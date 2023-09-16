const router = require("express").Router();

const weatherController = require("../controllers/weatherControllers") ;


router.post('/add' , weatherController.createWeather);
router.get('/' , weatherController.getAllWeather);
router.post('/sendReport' , weatherController.sendAllWeather);
router.get('/searchByDate' , weatherController.filterByDay);



module.exports = router ;