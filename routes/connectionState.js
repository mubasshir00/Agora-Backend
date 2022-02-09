const express = require('express')
const fs = require('fs')

const corn = require('node-cron')

const router = express.Router()

// var reconnectingUserArray = []

router.post("/", (req, res) => {
    const allUsers = loadUsersState()

    console.log('lll', req.body);
    const newUser = req.body;
    console.log(newUser.currentState);
    // setTimeout(()=>{
    //     console.log('HIIIIIII');
    // },4*1000)

    // function myFunc(arg) {
    //     console.log(`arg was => ${arg}`);
    // }

    // setTimeout(myFunc, 1500, 'funky');

    // if (newUser.currentState === "RECONNECTING"){
    //     reconnectingUser()
    // }
    res.send(newUser);
    allUsers.push(newUser)
    saveUser(allUsers);
    // scheduling()
})

// const reconnectingUser = () =>{
//     const userArray = loadUsersState()
//     console.log(userArray);
//     const reconnectingUserArray = [] 
//     reconnectingUserArray.push(userArray.find((i) => i.currentState === "RECONNECTING"))
//     console.log('Reconnecting', reconnectingUserArray);
// }

corn.schedule('* * * * *', () => {
    const filterUsers = loadUsersState()
    const user = []
    user.push(filterUsers.filter((i) => i.currentState === "RECONNECTING"))
    console.log(user);
});

const saveUser = (user) => {
    // setTimeout(() => {
    //     console.log('HIIIIIII');
    // }, 4 * 1000)
    
    const data = JSON.stringify(user)
    // console.log('data',data);
    fs.writeFileSync('connectionstate.json', data)
}

const loadUsersState = () => {
    try {
        const buffer = fs.readFileSync('connectionstate.json')
        const dataJSON = buffer.toString()
        return JSON.parse(dataJSON)
    } catch {
        return []
    }
}

module.exports = router