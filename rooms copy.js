require('dotenv').config()
const express = require('express');
const app = express()
const jwt = require('jsonwebtoken')
const rooms = setRooms();
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
function setRooms()
{
    let rooms={}
    let tictext="TickTacToe Room: "
    for (let roomNum=1; roomNum<=30; roomNum++)
    {
        rooms[tictext+roomNum] = []
    }
    //console.log("rooms list")
    //console.log(rooms)
    return rooms
}

module.exports = {
    roomDetails: function(){
            let roomdetail=[]
            for (const roomName in rooms)
            {
                //console.log(rooms[roomName])
                roomdetail.push({
                    title: roomName,
                    text: tictactoeRoomText,
                    userCount: rooms[roomName].length
                })
            }
            //console.log("room detail")
            //console.log(roomdetail)
            return roomdetail
        },
    joinRoom: function(req){
        console.log(req.body)
        let room = req.body.card
        let user = req.body.user
        //[card, user]=[req.body]
        if (rooms[room.title].length>=2)
        {
            return true;
        }else{
            rooms[room.title].push(user)
            console.log(rooms)
            return false;
        }
    },
    leaveRoom: function(req){
        console.log(req.body)
        let room = req.body.card, users=rooms[room.title]
        let user = req.body.user
        var usersLeftInRoom = users.filter(function(userElm) { return userElm != user; }); 
        rooms[room.title]=usersLeftInRoom
    }
}