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
    const _id = socket.id
    console.log('Socket Connected: ' + _id)
    socket.on("generateRooms",()=>{ //listens to generate rooms if someone emits to it then it will call this 
        console.log(":::...Generating Rooms...:::")
        let roomtosend=rooms.roomDetails()

        socket.emit("generateRooms",roomtosend) //sends to the socket who just connected, sent an emit and is listening on the channel
        console.log(":::::::Successfully generated rooms:::::::")
    })
    socket.on("setBoard",(room,stepNumber,history, xisnext)=>{ //listens to generate rooms if someone emits to it then it will call this 
        io.to(room).emit('setBoard', stepNumber,history, xisnext );
    })
    socket.on("setMappedUser",(room,sharedMappedUser)=>{ //listens to generate rooms if someone emits to it then it will call this 
        io.to(room).emit('setMappedUser', sharedMappedUser );
    })
    socket.on("joinRoom",(room,user)=>{
        console.log("room="+ room)
        console.log("user="+ user)
        if((room!==null && user!==null) && rooms.joinRoom({id: socket.id,room,user} )){
            socket.join(room);
            let roomtosend=rooms.roomDetails()
            io.emit("generateRooms",roomtosend) //sends to every connected client
            io.to(room).emit('userRoomData', { room: room, users: rooms.getUsersInRoom(room) });
        }
    })
    socket.on("disconnect", async () => {

        console.log('Socket disconnected: ' + _id)
        console.log('users in room=')

        let userInRoom=rooms.leaveRoom(socket.id)
        console.log(userInRoom)
        let roomtosend=rooms.roomDetails()

        io.emit("generateRooms",roomtosend) //sends to every connected client
        if(userInRoom){
            io.to(userInRoom).emit('userRoomData', { room: userInRoom, users: rooms.getUsersInRoom(userInRoom) });
        }
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

     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
         if(err) return res.sendStatus(401)
         req.user = user 
         next()
     })
}

server.listen(process.env.PORT || port, () => console.log(`Server has started. On port ${process.env.PORT}`));

