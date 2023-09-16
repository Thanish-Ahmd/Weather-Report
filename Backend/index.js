const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/users");
const weatherRouter = require("./routes/weathers");
const Weather = require("./models/Weather");
const User = require("./models/User");
const axios = require("axios");

const nodemailer = require("nodemailer");
const port = 3000;

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const sendAllWeather = async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        user: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: "login",
          user: "weathereportcodescale@gmail.com",
          pass: process.env.GMAIL_PASSWORD,
        },
      });

  try {
    const users = await User.find();

    users.map(async (user) => {
      const longitude = user.longitude;
      const latitude = user.latitude;
      const email = user.email;

      await axios
        .post(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=9ead8fab98b802bacc720c7eb0537a61`
        )
        .then(async (response) => {
          const report = response.data;

          console.log(response.data);

          const newReport = new Weather({
            user,
            report,
          });

          newReport.save();

          const mailOptions = {
            from: "dentalclinicitp@zohomail.com",
            to: `${email}`,
            subject: "Weather Report",
            text: `Coordinates\nLatitude : ${report.coord.lat}\nLongitude : ${report.coord.lon}\n\n${report.weather[0].main}\nDescription : ${report.weather[0].description}\n\nTemperature : ${report.main.temp}\nFeels Like : ${report.main.feels_like}\nPressure : ${report.main.pressure}\nHumidity : ${report.main.humidity}\nSea Level : ${report.main.sea_level}\nGround Level : ${report.main.grnd_level}\n\nWind Speed : ${report.wind.speed}\nWind deg : ${report.wind.deg}\n\nCountry : ${report.sys.country}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    console.log("Weather reports Sent");
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to send the report");
  }
};

const interval = 60 *60* 1000;
setInterval(sendAllWeather, interval);
app.use("/api/user", userRouter);
app.use("/api/weather", weatherRouter);

app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
