const User = require('../models/User');


module.exports = {
    createUser: async(req,res) => {

        const name = req.body.name ;
        const email = req.body.email ;
        const longitude = req.body.longitude ;
        const latitude = req.body.latitude ;


        const newUser = new User({
            name,
            email,
            longitude,
            latitude
        });
        try {
            await newUser.save();
            res.status(200).json("User Created Successfully")
        } catch (error) {
            console.log(error) ;
            res.status(500).json("Failed to create the user")
        }
    },


    getAllUsers: async(req,res)=>{
        try {
            const users = await User.find().sort({createdAt: -1}) ;
            res.status(200).json(users) ;
        } catch (error) {
            console.log(error) ;
            res.status(500).json("Failed to get the users")
        }
    } ,


    getUser: async(req,res)=>{
        try {
            const user = await User.findById(req.params.id) ;
            res.status(200).json(user) ;
        } catch (error) {
            res.status(500).json("Failed to get the user")
        }
    } ,


    updateUser: async(req,res)=>{
        const uid = req.params.id ;
        const name = req.body.name ;
        const email = req.body.email ;
        const longitude = req.body.longitude ;
        const latitude = req.body.latitude ;

        const updatedUser = {
            name,
            email,
            longitude,
            latitude
        }
        try {
            const update =  await User.findByIdAndUpdate(uid , updatedUser).then(()=>{
                res.status(200).send({status: "User  updated" })
            }).catch((err) => {
                console.log(err) ;
                res.status(500).send({ status: "Error with updating information" , error : err.message }) ;
            })
            
        } catch (error) {
            res.status(500).json("Failed to get update the user")
        }
    }


}


