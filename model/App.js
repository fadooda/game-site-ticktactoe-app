const express = require('express');
const app = express()
const port =5000
const server = require('http').createServer();
//const app = express(server)
const options={
    cors:true
   }
const io = require('socket.io')(server, options);


io.on("connection", (socket)=>{
    console.log("here")
    socket.on("message",(message)=>{
        console.log(message)
        socket.broadcast.emit("message",message)
    })
})

app.listen(port, () => {
    console.log('Server started.')
  });

server.listen(8000);




