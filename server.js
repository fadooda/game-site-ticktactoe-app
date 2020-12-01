require('dotenv').config()
const express = require('express');
const app = express()
const jwt = require('jsonwebtoken')
//const rooms = setRooms();
var rooms = require('./rooms');
const tictactoeRoomText='Join a tictactoe game!'

app.use(express.json())
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



app.get('/games/rooms', authenticateToken, (req,res)=>{
    res.json(rooms.roomDetails())
})

app.post('/games/joinroom', authenticateToken, (req,res)=>{
    let isfull=rooms.joinRoom(req)
    res.json({isRoomFull: isfull})
})
function authenticateToken(req,res,next)
{
     const authHeader = req.headers['authorization']
     const token = authHeader && authHeader.split(' ')[1]
     if(token == null) 
     {
         return res.sendStatus(401)
     }
     //console.log(token)
     //console.log(process.env.ACCESS_TOKEN_SECRET)
     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
         if(err) return res.sendStatus(401)
         req.user = user 
         next()
     })
}

app.listen(7000)