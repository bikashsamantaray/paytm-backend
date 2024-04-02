const mongoose = require("mongoose");
const { number } = require("zod");

mongoose.connect("mongodb+srv://admin:n1L1seKrHPU4clgo@cluster0.qwnafzl.mongodb.net/paytm")

const UserSchema =new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})

const AccountSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})

const User = mongoose.model('User',UserSchema)
const Account = mongoose.model('Account',AccountSchema)

module.exports = {
    User,
    Account
}