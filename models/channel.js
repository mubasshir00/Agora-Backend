const mongoose = require('mongoose')

const channelSchema = mongoose.Schema({
    uid:{
        type:Number,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    channelName:{
        type:String,
        required:true
    },
    expireTime:{
        type:String,
        required:true
    },
    createdTime:{
        type:String
    }
})

exports.Channel = mongoose.model('Channel',channelSchema)