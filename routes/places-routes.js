const express = require('express')
const router = express.Router();

const testData = [
    {
        id : 'p1',
        title : 'TTTTTITITITITLE 1',
        description : 'YYYYYYYY'
    }
]

router.get('/:pid',(req,res,next)=>{
    // console.log('GET Request');
    const placeId = req.params.pid;
    // const place = testData.find(p=>{
    //     return 
    // })
    res.json({message:'It Works!!'})
})

module.exports = router