const express = require('express')
const fs = require('fs')

const corn = require('node-cron')

const router = express.Router()

// var reconnectingUserArray = []

router.post("/", (req, res) => {
    const allUsers = loadUsersState()

    // console.log(allUsers);

    console.log('lll', req.body);
    const newUser = req.body;
    console.log(newUser);
    const newUserObject = {
        "uid": newUser.uid,
        "userState" : [
            {
                "currentState" : newUser.currentState,
                "previousState": newUser.previousState,
                "timeStamp": newUser.timeStamp
            }
        ]
    }
    const findExistingUser = allUsers.find((i)=>i.uid === newUser.uid)
    // const tempAllUser = allUsers.filter((i)=>i.uid === newUser.uid)
    // console.log('tempAllUser', tempAllUser);
    if(!findExistingUser){
        res.send(newUser);
        allUsers.push(newUserObject)
        saveUser(allUsers);
    }
    else {
        // console.log('aaaaaa',newUserObject.userState[0]);

        const tempAllUser = allUsers.filter((i) => i.uid === newUser.uid)
        console.log('tempAllUser', tempAllUser);

        const {currentState,previousState,timeStamp} = {...newUserObject.userState[0]};
        console.log('newUserObject', newUserObject);
        findExistingUser.userState.push({
            "currentState": currentState,
            "previousState": previousState,
            "timeStamp": timeStamp
        });
        console.log('findExistingUser',findExistingUser);
        
        const newUsers = allUsers.findIndex((obj=>obj.uid === findExistingUser.uid))

        allUsers[newUsers].userState = findExistingUser.userState
        
        console.log('newUsers',allUsers);
        // allUsers.push(findExistingUser)
        saveUser(allUsers)
        // saveUser(findExistingUser)
    }
    // scheduling()
})

// const reconnectingUser = () =>{
//     const userArray = loadUsersState()
//     console.log(userArray);
//     const reconnectingUserArray = [] 
//     reconnectingUserArray.push(userArray.find((i) => i.currentState === "RECONNECTING"))
//     console.log('Reconnecting', reconnectingUserArray);
// }

corn.schedule('1 * * * *', () => {
    const filterUsers = loadUsersState()
    // console.log('corn', filterUsers);
    console.log('aaaaaaaaaaa');
    const res = filterUsers.map((i)=>i.uid)
    console.log('corn', res);
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