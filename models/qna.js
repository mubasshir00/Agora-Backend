const mongoose = require('mongoose');

const qnaSchema = mongoose.Schema({
    uid:{
        type:Number,
        required:true,
    },
    
})

exports.Qna = mongoose.model('QNA',qnaSchema)