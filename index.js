// http://localhost:8080/access_token?channelName=test&role=subscriber&uid=1234&expireTime=6500

// const bodyParser = require('body-parser')
const cors = require('cors')
const placesRoutes = require('./routes/places-routes')
const morgan = require('morgan')

const fs = require('fs')

const express = require('express')

const { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } = require('agora-access-token');

const users = require("./routes/user")
const connectionstateusers = require("./routes/connectionState")

const dotenv = require('dotenv');
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
    const channelName = req.query.channelName;

    if(!channelName){
        return resp.status(500).json({'error':'channel is required'})
    }
    //get uid
    let uid = req.query.uid;
    if(!uid || uid == ''){
        uid = 0
    }

    //get role
    let role = RtcRole.SUBSCRIBER;

    if(req.query.role === 'publisher'){
        role = RtcRole.PUBLISHER
    }

    //get the expiration time
    let expireTime = req.query.expireTime;
    if(!expireTime || expireTime == ''){
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime,10);
    }

    //calculation priviege expire time
    const currentTime = Math.floor(Date.now()/1000);

    const privilegeExpireTime = currentTime + expireTime;

    //build the token
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID,APP_CERTIFICATE,channelName,uid,role,privilegeExpireTime);

    let tokenStore =[
        {
            'uid': uid,
            'token': token,
            'channelName': channelName,
            'expireTime': expireTime,
        }
    ]

    fs.writeFileSync('test.json', JSON.stringify(tokenStore))

    //return the token
    return resp.json({
        'uid': uid,
        'token': token,
        'channelName': channelName,
        'expireTime': expireTime,})
}

//  let tokenStore =[
//      {
//          'uid': uid,
//          'token': token,
//          'Channel Name': channelName
//      }
//  ]

// fs.writeFileSync('test.json', JSON.stringify(tokenStore))

app.get('/access_token',nocache,generateRTCToken);

app.use('/api/home',placesRoutes);

// app.get('/api/v1/users',(req,res)=>{
//     const user = {
//         id:1,
//         name:'ASA S'
//     }
//     res.send(user)
// })

// router.post(`/api/v1/users`,(req,res)=>{
//     console.log('lll',req.body);
//     const newUser = req.body;
//     console.log(newUser);
//     res.send(newUser);
//     fs.writeFileSync('test1.json', JSON.stringify(newUser))
// })

app.use("/api/v1/users",users)

app.use("/api/v1/connectionstate", connectionstateusers)

app.listen(PORT,()=>{
    // console.log(api);
    console.log(`Listening on port : ${PORT}`);
})