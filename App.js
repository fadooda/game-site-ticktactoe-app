require('dotenv').config()
const express = require('express');
const http = require('http')
const socketio = require('socket.io')
const cors = require('cors')

const app = express()
const port =7000
app.options('/games/authenticate', cors()) // enable pre-flight request for DELETE request
app.options('/login', cors()) // enable pre-flight request for DELETE request
//set option to include cors as true to bypass cors error

app.use(express.json())
  const options={
    cors:true
   }

const server = http.createServer(app)  
const io = socketio(server, options);

const jwt = require('jsonwebtoken')
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



app.get('/games/authenticate',cors(), authenticateToken, (req,res)=>{
    res.json(true)
})
app.post('/login',cors(), (req,res)=>{
    //const username = req.body.username
    //const password = req.body.password
    //console.log('name '+ password)
    //db.collection.find_one({'ip': '61.228.93.0'})['history']
    console.log(process.env.REFRESH_TOKEN_SECRET)
    let user= {"userName": req.body.userName}
    dbConnect.getUser(user, async function(dbuser /* a is passed using callback */) {
        //console.log(a); // a is the object return by the database
        //console.log(dbuser)
        if(dbuser==null)
        {
            console.log("User doesn't Exist")
        }else{
            let str=dbuser
            const compare = await bcrypt.compare(req.body.password, dbuser.password);
            if(compare)
            {
                const accessToken = generateAccessToken(user)
                const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
                res.json({accessToken: accessToken, refreshToken: refreshToken})
            }else{
                str+= " Incorrect password"
                res.sendStatus(401)
            }

            //res.json({str})
        }
    })
    //const user = { name: username}
    //const accessToken = generateAccessToken(user)
    //const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    //refreshTokenList.push(refreshToken) //push it to the database
    //res.json({accessToken: accessToken, refreshToken: refreshToken})
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


server.listen(process.env.PORT || port, () => console.log(`Server has started. On port ${port}`));



