const express = require('express')
const app = express();
const morgan = require('morgan')
const mongoose = require('mongoose')
const router = express.Router()
const cors = require('cors');
const { Channel } = require('../models/channel');
const { User } = require('../models/users');
// require('dotenv/config')
app.use(cors());
app.options('*',cors());

router.get("/channel", async (req, res) => {
    const channelList = await Channel.find()

    if (!channelList) {
        res.status(500).json({ success: false })
    }

    res.send(channelList)
})

router.get("/users", async (req, res) => {
    const userList = await User.find()
    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList)
    
})

router.get("/channelUser",async(req,res)=>{
    const query = req.body.cid
    const userList = await User.find({
        "cid":query
    })
    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList)
})

module.exports = router