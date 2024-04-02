const express = require("express")
const { User, Account } = require("../db")
const { default: mongoose, mongo } = require("mongoose")
const authmiddleware = require("../middleware")
const router = express.Router()

router.get("/balance",authmiddleware, async(req,res) => {
    console.log("hi");
    const account = await Account.findOne({
        userId:req.userId
    }) 
    console.log(account);

    return res.status(200).json({
        balance: account.balance
    })
})

router.post("/transfer",authmiddleware, async (req,res) => {
    const session  = await mongoose.startSession()
    session.startTransaction();

    const {to,amount} = req.body;

    const account = await Account.findOne({
        userId : req.userId
    }).session(session)

    if(!account || account.balance<=amount){
        return res.status(200).json(
            {
                message: "Insufficient balance"
            }
        )
    }

    const toAccount = await Account.findOne({
        userId: to
    }).session(session)

    if(!toAccount){
        return res.status(200).json(
            {
                message: "Invalid account"
            }
        )
    }

    await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session)
    await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session)

    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    });


})

module.exports = router