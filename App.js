require('dotenv').config()
const express = require('express');
const http = require('http')
const socketio = require('socket.io')
const cors = require('cors')
const jwt = require('jsonwebtoken');
var rooms = require('./rooms');

const app = express()
const port =7000
app.options('/games/authenticate', cors()) // enable pre-flight request for DELETE request
//set option to include cors as true to bypass cors error

app.use(express.json())
  const options={
    cors:true
   }

const server = http.createServer(app)  
const io = socketio(server, options);



const tictactoeRoomText='Join a tictactoe game!'




io.on("connection", (socket)=>{
    //console.log("here")
    //if(authenticateToken)
    const _id = socket.id
    console.log('Socket Connected: ' + _id)
    socket.on("generateRooms",()=>{ //listens to generate rooms if someone emits to it then it will call this 
        let roomtosend=rooms.roomDetails()
        //console.log(roomtosend)
        socket.emit("generateRooms",roomtosend) //sends to the socket who just connected, sent an emit and is listening on the channel
    })

    socket.on("joinRoom",(room,user)=>{
        console.log("room="+ room)
        console.log("user="+ user)
        rooms.joinRoom({id: socket.id,room,user})
        socket.join(room);
        //console.log(`has joined room`)
        //console.log("in join room")
        //callback(hasjoinedroom)
        let roomtosend=rooms.roomDetails()
        //console.log(roomtosend)
        io.emit("generateRooms",roomtosend) //sends to every connected client
    })
    socket.on("disconnect", async () => {
        //await io.emit('disconnectClient', {customEvent: 'hello world'})
        console.log('Socket disconnected: ' + _id)
        console.log("leaving room")
        rooms.leaveRoom(socket.id)
        let roomtosend=rooms.roomDetails()
        //console.log(roomtosend)
        io.emit("generateRooms",roomtosend) //sends to every connected client
    })
})

app.get('/games/authenticate',cors(), authenticateToken, (req,res)=>{
    res.json(true)
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

server.listen(process.env.PORT || port, () => console.log(`Server has started. On port ${process.env.PORT}`));



