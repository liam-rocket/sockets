const app = require("express")();
const express = require("express");

// connecting express to our http module
const http = require("http").Server(app);
const io = require("socket.io")(http);

// serving the whole folder
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// MUST declare arrayOfRooms outside of connection
let arrayOfRooms = [];

// socket is listening to the word "connection"
io.on("connection", (socket) => {
  // when we connect, we show that someone has joined
  console.log("a user connected to the server");

  // joining chatrooms
  let chatroom = "default";

  socket.on("subscribe", (room) => {
    chatroom = room;
    socket.join(room);
    console.log("a user has joined our room: " + room);

    arrayOfRooms.push(room);
    console.log(arrayOfRooms);

    // emitting event back to app.js to change room name HTML
    io.to(chatroom).emit("joinRoom", room);
  });

  socket.on("disconnect", () => {
    console.log("a user has abandoned us ...");
  });

  socket.on("chatMessage", (data) => {
    console.log(data[1] + " says: " + data[0]);

    // run db queries here
    // find the user
    // find the conversation
    // do insert queries

    io.to(chatroom).emit("chatMessage", data);
  });
});

// always use .app unless you are using someone like socket
http.listen(8080, () => {
  console.log("application running at 8080");
});
