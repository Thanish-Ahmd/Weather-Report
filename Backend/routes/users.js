const router = require("express").Router();

const userController = require("../controllers/userControllers") ;


router.get('/' , userController.getAllUsers);
router.post('/add' , userController.createUser);
router.get('/:id' , userController.getUser);
router.put('/update/:id' , userController.updateUser);


module.exports = router ;