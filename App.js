require('dotenv').config()
const express = require('express');
const http = require('http')
const socketio = require('socket.io')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const dbConnect = require('./connectDB');
const bcrypt = require('bcrypt');

const app = express()
const port =7000

//set option to include cors as true to bypass cors error

app.use(express.json())
  const options={
    cors:true
   }

const server = http.createServer(app)  
const io = socketio(server, options);


var rooms = require('./rooms');
const tictactoeRoomText='Join a tictactoe game!'




io.on("connection", (socket)=>{
    //console.log("here")
    //if(authenticateToken)
    socket.on("generateRooms",()=>{ //listens to generate rooms if someone emits to it then it will call this 
        let roomtosend=rooms.roomDetails()
        //console.log(roomtosend)
        socket.emit("generateRooms",roomtosend) //sends to the socket who just connected, sent an emit and is listening on the channel
    })

    socket.on("joinRoom",(room,user)=>{
        rooms.joinRoom(room,user)
        let roomtosend=rooms.roomDetails()
        //console.log(roomtosend)
        io.emit("generateRooms",roomtosend) //sends to every connected client
    })
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        //clearInterval(interval);
    })
})


server.listen(process.env.PORT || port, () => console.log(`Server has started. On port ${process.env.PORT}`));



