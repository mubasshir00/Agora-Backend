const express = require('express');
const router = express.Router()

router.post("/",(req,res)=>{
    const newQuestion = {
        "uid" : "1",
        "questions": "What is Lorem Ipsum?",
        "answer" : [
            {
                "auid": "1",
                "answer" : "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            },
            {
                "auid": "2",
                "answer": "Contrary to popular belief, Lorem Ipsum is not simply random text",
            },
            {
                "auid": "3",
                "answer": "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
            },
            {
                "auid": "4",
                "answer": "There are many variations of passages of Lorem Ipsum available",
            },
        ],
    }
    res.send(newQuestion);
})



module.exports = router