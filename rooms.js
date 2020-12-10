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
    joinRoom: function({ id, room, user }){
        //[card, user]=[req.body]
        //console.log(rooms[room].length)
        if (rooms[room].length>=2)
        {
            return false;
        }else{
            rooms[room].push({id,user})
            //console.log(rooms)
            return true;
        }
    },
    leaveRoom: function(id){
        //console.log("room="+room)
        //console.log("user="+user)
        let roomUserIn
        for (const [room, users] of Object.entries(rooms)) {
            rooms[room]=users.filter(function(user) {
                 if(user.id === id){
                     roomUserIn=room
                    }
                 return  user.id !== id 
            });
            //console.log(room, users);
          }
        //let users=rooms[room]
        //var usersLeftInRoom = users.filter(function(userElm) { return userElm != user; }); 
        //rooms[room]=usersLeftInRoom
        return roomUserIn
    },

    getUsersInRoom: function(roomName){
        let userlist=[]
        let unfiltereduserlist=rooms[roomName]
        console.log(unfiltereduserlist)
        for(let index=0; index <unfiltereduserlist.length;index++){
            
            console.log(unfiltereduserlist[index].user)
            userlist.push(unfiltereduserlist[index].user)
        }
        return userlist
    }
}