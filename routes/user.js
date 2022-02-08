const express = require('express')
const fs = require('fs')

const router = express.Router()

router.post("/", (req, res) => {
    const allUsers = loadUsers()

    console.log('lll', req.body);
    const newUser = req.body;
    console.log(newUser);
    res.send(newUser);

    allUsers.push(newUser)
    saveUser(allUsers)
    
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