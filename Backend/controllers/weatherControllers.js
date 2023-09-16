const User = require("../models/User");
const Weather = require("../models/Weather");
const axios = require("axios");
const nodemailer = require("nodemailer");

module.exports = {
  createWeather: async (req, res) => {
    const uid = req.body.user;

    try {
      const user = await User.findById(uid);
      const longitude = user.longitude;
      const latitude = user.latitude;

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
          res.status(200).json("Report Created Successfully");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
      res.status(500).json("Failed to add the report");
    }
  },

  getAllWeather: async (req, res) => {
    try {
      const weathers = await Weather.find().sort({ createdAt: -1 });
      res.status(200).json(weathers);
    } catch (error) {
      console.log(error);
      res.status(500).json("Failed to add the report");
    }
  },

  sendAllWeather: async (req, res) => {
    //qhxyehydnbgkcawd
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

            const text = JSON.stringify(report);

            newReport.save();

            const mailOptions = {
              from: "dentalclinicitp@zohomail.com",
              to: `${email}`,
              subject: "Weather Report",
              text: `Coordinates\nLatitude : ${report.coord.lat}\nLongitude : ${report.coord.lon}\n\n${report.weather[0].main}\nDescription : ${report.weather[0].description}\n\nTemperature : ${report.main.temp}\nFeels Like : ${report.main.feels_like}\nPressure : ${report.main.pressure}\nHumidity : ${report.main.humidity}\nSea Level : ${report.main.sea_level}\nGround Level : ${report.main.grnd_level}\n\nWind Speed : ${report.wind.speed}\nWind deg : ${report.wind.deg}\n\nCountry : ${report.sys.country}`,
              //   text: `${text}`,
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

      res.status(200).json("Email Sent");
    } catch (error) {
      console.log(error);
      res.status(500).json("Failed to send the report");
    }
  },

  filterByDay: async (req, res) => {
    const user = req.body.id;
    const day = req.body.date;

    const searchDate = new Date(day);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    try {
      const weathers = await Weather.find({
        user: user,
        createdAt: {
          $gte: searchDate,
          $lt: nextDay,
        },
      }).sort({ createdAt: -1 });
      res.status(200).json(weathers);
    } catch (error) {
      console.log(error);
      res.status(500).json("Failed to add the report");
    }
  },
};
