import path from "path";
import express from "express";
import { createServer } from "http";
import Server from "socket.io";

import "./environment.js";
import { MessageService, RoomService } from "./services/index.js";

// todo: initialize services
const messageService = new MessageService();
const roomService = new RoomService();

// https://socket.io/docs/v4/server-initialization/#with-express
const app = express();
const http = createServer(app);
const io = new Server(http);

// serving the whole folder
const projectDirectory = "./";
app.use(express.static(path.normalize(projectDirectory)));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("chat", {});
});

// MUST declare arrayOfRooms outside of connection
let arrayOfRooms = [];

// socket is listening to the word "connection"
io.on("connection", (socket) => {
  // when we connect, we show that someone has joined
  console.log("a user connected to the server");

  console.log("socket id: ", socket.id);

  // joining chatrooms
  let chatroom = "default";

  socket.on("subscribe", async (roomName) => {
    chatroom = roomName;

    // todo: create room
    let room = await roomService.getRoomByName(roomName);
    if (!room) {
      room = await roomService.createRoom(roomName);
    }

    const messages = await messageService.listMessagesByRoom(room.id);

    socket.join(roomName);
    console.log("a user has joined our room: " + room);

    arrayOfRooms.push(roomName);
    console.log(arrayOfRooms);

    // todo: send back room and messages object
    // emitting event back to app.js to change room name HTML
    io.to(chatroom).emit("joinRoom", { room, messages });
  });

  socket.on("disconnect", () => {
    console.log("a user has abandoned us ...");
  });

  // todo: listen for if user leave room
  socket.on("unsubscribe", (room) => {
    try {
      console.log("[socket]", "leave room :", room);
      socket.leave(room);
      socket.to(room).emit("user left", socket.id);
    } catch (e) {
      console.log("[error]", "leave room :", e);
      socket.emit("error", "couldnt perform requested action");
    }
  });

  socket.on("chatMessage", async (data) => {
    const sender = data[1];
    const message = data[0];
    const room = data[2];

    console.log(sender + " says: " + message);
    await messageService.createMessage(room.id, sender, message);

    io.to(chatroom).emit("chatMessage", data);
  });
});

// always use .app unless you are using someone like socket
http.listen(8080, () => {
  console.log("application running at 8080");
});
