import './App.css';
import io from 'socket.io-client';
import {useState} from "react";
import Chat from './Chat';

//connecting frontend to backend
const socket = io.connect("http://localhost:3001");

//now we have to establish a connection with our socket.io server.
//Whenever someone enters a website, it should console.log the id of the user in our backend
function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  //function to join a room when you click on Join A Room button
  //this function will primarily establish a connection between the user who logged in and the socket io room
  //that they want to enter
  const joinRoom = () => {
    console.log(`this is ${room}`);
    if(username !== "" && room !== ""){
      // room will be received in the backend as "data" which we passed in the callback function
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
      <div className='joinChatContainer'>
        <h3>Join A Chat</h3>
        {
          // in order to have a chat between 2 people, we want to make sure that they are in the same
          // room, and a room ,in socket.io,is basically where you are broadcasting your data. So if i send a 
          // message to a room which has a specific id, only the people who have joined the room will see that
          // message.
        }
        <input 
          type="text" 
          placeholder="John..." 
          onChange={(event) => {
            setUsername(event.target.value);
          }}>
        </input>
        <input 
          type="text" 
          placeholder="Room ID..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}>
        </input>
        <button onClick={joinRoom}>Join A Room</button>
      </div> )
      : (
      <Chat socket={socket} username={username} room={room}/>
      )}
    </div>
  );
}

export default App;
