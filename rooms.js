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
    return rooms
}

module.exports = {
    roomDetails: function(){
            let roomdetail=[]
            for (const roomName in rooms)
            {
                roomdetail.push({
                    title: roomName,
                    text: tictactoeRoomText,
                    userCount: rooms[roomName].length
                })
            }
            return roomdetail
        },
    joinRoom: function({ id, room, user }){

        if (rooms[room].length>=2)
        {
            return false;
        }else{
            rooms[room].push({id,user})
            return true;
        }
    },
    leaveRoom: function(id){
        let roomUserIn
        for (const [room, users] of Object.entries(rooms)) {
            rooms[room]=users.filter(function(user) {
                 if(user.id === id){
                     roomUserIn=room
                    }
                 return  user.id !== id 
            });
          }
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