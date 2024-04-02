const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const zod = require("zod");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const authmiddleware = require("../middleware");


//zod schema
const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string()
})




router.post("/signup", async (req,res) => {

    
    
    //zod validation
    const {success} = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({msg:"Invalid input"})
    }

    //check existing user
    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser){
        return res.status(411).json({msg:"user already exist in database "})
    }

    //create new user
    const user = await User.create({
        username:req.body.username,
        password:req.body.password,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
    })

     const userId = user._id;

		

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET);


    res.json({
        msg:"user created successfully",
        token:token
    })

})


//signin
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin" ,async (req,res) => {

    const {success} = signinSchema.safeParse(req.body)

    if(!success){
        return res.status(411).json({
            msg:"Invalid input"
        })
    }

    const username= req.body.username;
    const password =req.body.password;

    const existingUser = await User.findOne({username: username,password:password})

    if(!existingUser){
        return res.status(411).json({
            msg:"error while logging in"
        })
    }else{
        var token = jwt.sign({userId:existingUser._id},JWT_SECRET)
        return res.status(200).json({
            token: token,
            name: existingUser.firstname
        })
    }
})

//put/change firstname password lastname

const updateSchema = zod.object({
    username:zod.string().email(),
    firstname:zod.string(),
    lastname:zod.string()
})

router.put("/",authmiddleware,async (req,res) => {

    const {success} = updateSchema.safeParse(req.body)
    
    if (!success) {
        return res.status(411).json({
            error : "Invalid data passed"
        })
    }

    await User.updateOne(req.body,{
        id:req.userId
    })

    res.json({message:"Updated succesfully"})


})

router.get("/bulk", async (req,res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        },{
            lastname : {
                "$regex" : filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username:user.username,
            firstname:user.firstname,
            lastname:user.lastname,
            _id:user._id
        }))
    })
})


module.exports = router
