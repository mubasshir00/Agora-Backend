// http://localhost:8080/access_token?channelName=test&role=subscriber&uid=1234&expireTime=6500

// const bodyParser = require('body-parser')
const BroadcastingInfo = require('./routes/broadcastingdata')

const cors = require('cors')
const placesRoutes = require('./routes/places-routes')
const morgan = require('morgan')

const mongoose = require('mongoose')

const fs = require('fs')

const express = require('express')

const { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } = require('agora-access-token');

const users = require("./routes/user")
const connectionstateusers = require("./routes/connectionState")

const dotenv = require('dotenv');
const res = require('express/lib/response')
const { Channel } = require('./models/channel')
const { User } = require('./models/users')
dotenv.config();

const PORT = 8080

// const api = process.env.API_URL

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const app = express();

//MiddleWare
app.use(express.json());
const router = express.Router();

app.use(morgan('tiny'));

app.use(cors({origin:true,credentials:true}))
app.options('*',cors())

const nocache = (req,resp,next) =>{
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

const generateRTCToken = (req,resp) =>{
    //set response header
    resp.header('Acess-Control-Allow-Origin', '*');
    // resp.header("Access-Control-Allow-Headers", "X-Requested-With");

    //get channel name
    const channelName = req.body.channelName;

    // console.log(channelName);

    if(!channelName){
        return resp.status(500).json({'error':'channel is required'})
    }
    //get uid
    let uid = req.body.uid;
    if(!uid || uid == ''){
        uid = Math.floor(Math.random() * 100)+Date.now()
    }

    //get role
    let role = RtcRole.SUBSCRIBER;

    if(req.body.role === 'publisher'){
        role = RtcRole.PUBLISHER
    }

    //get the expiration time
    let expireTime = req.body.expireTime;
    if(!expireTime || expireTime === ''){
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime,10);
    }

    //calculation priviege expire time
    const currentTime = Math.floor(Date.now()/1000);

    const privilegeExpireTime = currentTime + expireTime;

    //build the token
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID,APP_CERTIFICATE,channelName,uid,role,privilegeExpireTime);


    const allToken = loadToken()

    let tokenStore = new Channel(
        {
            uid: uid,
            token: token,
            channelName: channelName,
            // role:role,
            expireTime: expireTime,
            createdTime: Date.now()
        }
    )

    tokenStore.save().then((createdToken=>{
        resp.status(201).json(createdToken)
    })).catch((err)=>{
        resp.status(500).json({
            error:err,
            sucess:false
        })
    })

    allToken.push(tokenStore)

    saveToken(allToken)
   

    //return the token
    return resp.json({
        'uid': uid,
        'token': token,
        'channelName': channelName,
        'role': role,
        'expireTime': expireTime,})
}

const saveToken = (tokenData) =>{
    const data = JSON.stringify(tokenData)
    fs.writeFileSync('token.json', data)
}

const loadToken = () =>{
    try {
        const buffer = fs.readFileSync('token.json')
        const dataJSON = buffer.toString()
        return JSON.parse(dataJSON)
    } catch{
    return []
    }
}

// const usersCreate

//  let tokenStore =[
//      {
//          'uid': uid,
//          'token': token,
//          'Channel Name': channelName
//      }
//  ]

// fs.writeFileSync('test.json', JSON.stringify(tokenStore))

app.use("/access_token",generateRTCToken);

app.use("/api/home",placesRoutes);

app.use("/api/v1/users",users)


//get all channel info
// app.get("/channel",async (req,res)=>{
//     const channelList = await Channel.find()

//     if(!channelList){
//         res.status(500).json({success:false})
//     }

//     res.send(channelList)
// })
app.use("/broadcasting", BroadcastingInfo)

//get all user info
// app.get("/users",async (req,res)=>{
//     const userList = await User.find()
//     if(!userList){
//         res.status(500).json({ success: false })
//     }
//     res.send(userList)
// })

app.use("/api/v1/connectionstate", connectionstateusers)

mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser: true,
    dbName:'agora'
},()=>{
    console.log('Database connected');
})
// .then(()=>{
//     console.log('DataBase connected');
// })
// .catch((err)=>{
//     console.log(err);
// })

app.listen(PORT,()=>{
    // console.log(api);
    // console.log(process.env.CONNECTION_STRING);
    console.log(`Listening on port : ${PORT}`);
})