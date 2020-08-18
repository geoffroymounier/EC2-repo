const express=require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const bodyParser = require('body-parser');
const {auth}=require('./core');
const {getResetPasswordToken,createResetPasswordToken} = require('./routes/redismethods.js')
const {verifyToken} = require('./routes/middlewares.js');
const {sendResetPasswordMail} = require('./routes/mailMethods.js');

dotenv.config();
const port = process.env.PORT || '8080'
const portWebpack = process.env.PORT_WEBPACK || '8008'
const dbUser =  process.env.DBUSER || null
const dbPass = process.env.DBPASS || null
const cluster = process.env.CLUSTER || null

const app = express();
const server = http.createServer(app);

const connnectString = `mongodb+srv://${dbUser}:${dbPass}@${cluster}.mongodb.net/test`
mongoose.connect(connnectString,{ useNewUrlParser: true })
.then(()=>console.log('connected to mongoDB'))
.catch((e)=>console.log('error with MongoDB : '+e))


if (process.env.NODE_ENV !== 'production') {
  app.use(cors({origin: `http://localhost:${portWebpack}`, credentials: true }));
} 

app.use(express.static(path.resolve(__dirname,`../../dist`)))
app.get(/^(?!\/api\/)/,(_,res) => {
  res.sendFile(path.resolve('index.html'))
})


app.use(bodyParser.urlencoded({limit: '2mb', extended: true}))
app.use(bodyParser.json({limit: '2mb', extended: true}))


//body : email
app.post('/api/askForReset',(req,res) => {
  const {email} = req.body;
  auth.findEmail(email).then((userId)=>{
    createResetPasswordToken(userId).then(passwordToken=>{   //create token in redis, available 15 minutes
      sendResetPasswordMail(req.hostname,email,userId,passwordToken).then(()=>{ //send the RESET mail, in which the token
        res.status(200).send({
          message:"resetPasswordToken sent by mail"
        })
      })
    })
    .catch(e=>{
      res.status(500).send();     // couldn't create token
    })
  })
  .catch(e=>{
    res.status(404).send()      // user not found
  })
})


app.post('/api/newPassword',(req,res) => {
  getResetPasswordToken(userId).then((retrievedToken)=>{
    if (retrievedToken !== token) {
      return res.send({status:412,message:'request has expired, please have a reset email sent again'})
    }
    auth.resetPass(userId,password).then(()=>{
      return res.send({status:200,message:'successfully modified'})

    }).catch((error)=>{
      res.send(error)
    })
  }).catch((error)=>{
    res.send(error)
  })
})


app.post('/api/login',(req,res) => {
  auth.login(req.body).then((token)=>{ 
    if (token){ 
      res.status(200).send({
        "message":"Logged in",
        "token":token
      })
    }else{                    // password doesn't match => 401
      res.status(401).send({
        "message":"Wrong password for "+ req.body.email
      })
    }
  }).catch(err=>{
    res.status(404).send({    // no user found OR database down...
      "message":"No user found for this email"
    })
  })
})

// all which is below this points need to pass token validation !
app.use((req,res, next) => {
  verifyToken(req,res,next)
}) 

// => must have a valid token !

app.post('/api/changeAuth',(req,res) => {
  auth.update(req.body,req.decoded.userId).then((token)=>{ //look in Auth
    if (token){          // (email,password) exists => 200 + token
      res.status(200).send({
        "message":"Credentials changed",
        "token":token
      })
    }else{                    // password doesn't match => 401
      res.status(401).send({
        "message":"Wrong password for "+ req.body.email
      })
    }
  }).catch(err=>{
    res.status(err.status || 500).send({    // no user found OR database down...
      "message":err.message
    })
  })
})

server.listen(port,()=>console.log("...listening HTTP on port " + port));

