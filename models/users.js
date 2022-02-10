const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({
    uid:{
        type:Number,
        required:true
    },
    joinAt:{
        type:String,
        required: true
    },
    duration:{
        type:String,
        required: true
    },
    startTime:{
        type: String,
        required: true
    },
    cname:{
        type:String,
        required: true
    },
    cid:{
        type:String,
        required: true
    }
}) 

exports.User = mongoose.model('User',usersSchema)