import React, { useEffect } from 'react'
import {useState} from "react";
import ScrollToBottom from "react-scroll-to-bottom";


//in this component we will be sending and receiving messages through socket.io, so we do
//need to pass the socket variable that we created in the App.js in frontend as props to our chat component, and also
//we need to keep track of the username of user and the room of the user

const Chat = ({socket, username, room}) => {
    const [currentMessage, setCurrentMessage] = useState("");

    //this state will represent list of messages coming into your chat
    const [messageList, setMessageList] = useState([]);

    //this function will allow us to send messages through socket server.
    //this function is asynchronous so that we actually wait for the message to be sent
    const sendMessage = async () => {
        if(currentMessage !== ""){

            // when we send a message ,we want several things with it,like the time, and the user who sent it,
            // so this object messageData will store that.
            // And we will send this object to our socket server
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    //useEffect will listen whenever there are changes to our socket,i.e.,it is going to listen every time it receives another message.
    //the second parameter in useEffect is "socket", so whenever it changes it should call the fucntion in first parameter.
    //this is the frontend listening to the backend
    useEffect(() => {
        socket.on("receive_message", (data) => {
            //the "list" in the parantheses is the previous current message list, and we are addding new message "data" to it
            setMessageList((list) => [...list, data]);
            
        });
        //this return statement is added so that the sent message is not displayed twice in the receivers box,it is a cleanup function.
        return () => socket.removeListener('receive_message');
    }, [socket]);

    return (
      <div className='chat-window'>
          <div className='chat-header'>
              <p>Live Chat</p>
          </div>
          <div className='chat-body'>
            <ScrollToBottom className='message-container'>
            {
                messageList.map((messageContent) => {
                    return (
                    <div className='message' id={username === messageContent.author ? "you" : "other"}>
                        <div>
                            <div className='message-content'>
                                <p>{messageContent.message}</p>
                            </div>
                            <div className='message-meta'>
                                <p id="time">{messageContent.time}</p>
                                <p id="author">{messageContent.author}</p>
                            </div>
                        </div>
                    </div>);
                })
            }
            </ScrollToBottom>
          </div>
          <div className='chat-footer'>
              <input 
                type="text" 
                value={currentMessage}
                placeholder='Hey...'
                onChange={(event) => {
                    setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                    event.key === "Enter" && sendMessage();
                }}
                ></input>
              <button onClick={sendMessage}>&#9658;</button>
          </div>
      </div>
    )
  }

export default Chat