const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

//if we were not working with socket.io then you could have used other way to create server for express,
//but socket.io is created upon a http server ,so this is the recommended way of doing this.
const server = http.createServer(app);

//socket.io is a library that enables event-based communication between a client and a server.

const io = new Server(server, {
    //cors is used for resolving issues that you might come across while using socket io
    cors: {
        origin: "http://localhost:3000", //this origin is basically telling our server which server or url is going to be calling and making the calls to out socket.io server,
                 //so which server will be doing that? our react server, so we pass the url to where the react application will be running
        methods: ["GET", "POST"], // we can specify which methods we accept,for eg,if you have problem in making some sort of requests,
                                  // then you can come over here and you can specify which requests you accept  
    },
});

//1) this means we are listening for an event with "connection" as its id, and every piece of code we will write for socket.io will be inside the parantheses, because 
//you should only be listening to events if the user has actually been connected to the server
//2) and whenever we listen to an event , we always enact some action as a callback function.
//3) so whenever someone connects, we call the callback function and we can grab one important thing from it ,i.e. socket(which is inside the parantheses in the callback)
io.on("connection", (socket) => {
    //each user gets a specific id when they connect to the socket server
    console.log(`User connected ${socket.id}`);


    //whenever someone wants to join a room
    //So whenever someone emits an event,here "join_room",we want to join them based on the id of the room they entered in the frontend
    //we have the room string in the frontend, so how do we send it to the backend? We can do that by passing it as an argument in the callback function
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    //the data here will contain the message_data object from frontend
    socket.on("send_message", (data) => {
        //we have a room and we only want to emit that message to that particular room, we can do this by using this
        socket.to(data.room).emit("receive_message", data);
    });

    //this is to disconnet from your server, and the callback will be called when someone tries to disconnects 
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});


server.listen(3001, () => {
    console.log("SERVER RUNNING");
});