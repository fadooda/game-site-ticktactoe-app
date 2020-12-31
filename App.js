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


x
io.on("connection", (socket)=>{
    const _id = socket.id
    console.log('Socket Connected: ' + _id)
    socket.on("generateRooms",()=>{ //listens to 'generateRooms' if a client emits to it then it will call this and emit to all 
        console.log(":::...Generating Rooms...:::")
        let roomtosend=rooms.roomDetails()

        socket.emit("generateRooms",roomtosend) //sends rooms to the client socket that just connected
        console.log(":::::::Successfully generated rooms:::::::")
    })
    socket.on("setBoard",(room,stepNumber,history, xisnext)=>{ //listens to 'setBoard'. if a client emits to 'setBoard' then emit to all clients in the room the board state 
        io.to(room).emit('setBoard', stepNumber,history, xisnext );
    })
    socket.on("setMappedUser",(room,sharedMappedUser)=>{ //listens to 'setMappedUser'. if a client emits to 'setMappedUser' then emit to all clients in the room the current users turn  
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

        let userInRoom=rooms.leaveRoom(socket.id)  //leave room
        console.log(userInRoom)
        let roomtosend=rooms.roomDetails()  //generate new room list 

        io.emit("generateRooms",roomtosend) //Update all clients listening to 'generateRooms' that user has left room
        if(userInRoom){
            io.to(userInRoom).emit('userRoomData', { room: userInRoom, users: rooms.getUsersInRoom(userInRoom) });
        }
    })
})

/*
Authenticate jwt token, to ensure that the user has logged in 
*/
app.get('/games/authenticate',cors(), authenticateToken, (req,res)=>{
    res.json(true)
})

/**
 * authenticateToken: A function that Authenticates a jwt token, to ensure that both the user has logged in and that the user's access token is still not expired.
 * 
 * AuthenticateToken function will strip the authorization header from the request 
 * Then check the token against the ACCESS_TOKEN_SECRET to verify that the token is vaild
 * 
 * if the token is valid move to the next middlewear function 
 * else return 401 (unauthorized) status
 */
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
