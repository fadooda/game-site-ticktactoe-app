require('dotenv').config()
const rooms = setRooms();
const tictactoeRoomText='Join a tictactoe game!'


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
    joinRoom: function(room,user){
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