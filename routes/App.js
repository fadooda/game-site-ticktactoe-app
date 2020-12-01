// import './App.css'
// import React, { Component } from "react";
// import Header from './Header'
// //import Example from './LoginModal'



// class App extends Component {

//   render() {

//     return (
//       <div className="App">
//         <Header/>
//       </div>
//     );
//   }
// }

// export default App;

import React from 'react'
import './App.css'

import io from 'socket.io-client'

class App extends React.Component{
  constructor(){
    super()
    this.state={
      messages: []
    }
    this.sendMessage=this.sendMessage.bind(this)
  }
  componentDidMount(){
    this.socket = io("http://localhost:8000")
    this.socket.on("message", (message) =>{
      this.setState({messages: [message, ...this.state.messages]})
    })
  }
  sendMessage(event){
    const body = event.target.value

    if(event.keyCode===13 && body){
      let message ={
        body: body,
        from: 'Me'
      }
      this.setState({messages: [message, ...this.state.messages]})
      this.socket.emit("message",message)
    }
  }
  render(){
    return(
      <div className="App">
        
        <input type="text" placeholder="enter a message..." onKeyUp={this.sendMessage}/>
      {this.state.messages.map((message)=>{
       return (<p>message - {message.body} from {message.from}</p>) 
      })}
      </div>
    )
  }
  
}

export default App