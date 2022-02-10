const express = require('express')
const fs = require('fs')
const { User } = require('../models/users')

const router = express.Router()

 router.use("/",async (req, res) => {
    const allUsers = loadUsers()

    console.log('lll', req.body);
    const newUser = req.body;
    console.log('newUser',newUser);
    res.send(newUser);
    
    allUsers.push(newUser)

    let usersStore = new User(
        {
            uid: newUser.uid,
            joinAt: newUser.joinAt,
            duration: newUser.duration,
            startTime: newUser.startTime,
            cname: newUser.cname,
            cid: newUser.cid
        }
    )

    console.log('usersStore', usersStore);

    usersStore = await usersStore.save()

    if(!usersStore)
    return res.status(400).send('The user stored')

    res.send(usersStore)

    // await usersStore.save().then((createdUser=>{
    //     res.status(201).json(createdUser)
    // })).catch((err)=>{
    //     res.status(500).json({
    //         error:err,
    //         sucess:false
    //     })
    // })

   saveUser(allUsers)
    
})

router.get('/:uid',async (req,res)=>{
    const user = await User.findById(req.params.uid)
    if(!user){
        res.status(500).json({ success: false })
    }
    res.send(this.user)
})

const saveUser = (user) =>{
    const data = JSON.stringify(user)
    fs.writeFileSync('users.json',data)
}

const loadUsers = () =>{
    try {
        const buffer = fs.readFileSync('users.json')
        const dataJSON = buffer.toString()
        return JSON.parse(dataJSON)
    } catch {
        return []
    }
}

module.exports = router