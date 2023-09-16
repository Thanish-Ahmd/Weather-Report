const mongoose =  require("mongoose");

const schema = mongoose.Schema ;

const WeatherSchema = new mongoose.Schema({
    user: {type : schema.Types.ObjectId , ref: 'User',  required: true} ,
    report: {type : Object , required: true} 
   
    
}, {timestamps: true}) ;


module.exports = mongoose.model("Weather" , WeatherSchema);