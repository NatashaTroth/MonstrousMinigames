import dotenv from "dotenv";
import express from "express";
import User from "./classes/user";
import RoomService from "./services/roomService";
const socketIO = require("socket.io");

// load the environment variables from the .env file
dotenv.config({
  path: ".env",
});

class Server {
  public app = express();
}

// initialize server app
const server = new Server();
const http = require("http").Server(server.app);

const io = socketIO(server);

// const io = require("socket.io")(http, {
//   cors: {
//     origin: ["http://localhost:5050", "http://127.0.0.1:5500"],
//     methods: ["GET", "POST"],
//   },
// });

server.app.get("/", (req, res) => {
  res.send("GAAAAME");
});

const rs = new RoomService();
let room = rs.createRoom();
let user = new User(room.id, "Reinhold");
console.log(rs);

io.on("connection", function (socket: any) {
  // socket.handshake.query.roomId
  console.log(rs.getRoomById(socket.handshake.query.roomId));

  if (socket.handshake.query.type === "controller") {
    // params name, userId
    if (socket.handshake.query.userId) {
      // todo find user with id
    }
    console.log("Controller connected");

    socket.on("disconnect", () => {
      console.log("Controller disconnected");
    });

    socket.on("message", function (message: any) {
      console.log(message);

      // todo react on different message types
      socket.broadcast.emit("response", message);
    });
  } else {
    console.log("Client connected");

    // Todo user initialisation

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("message", function (message: any) {
      console.log(message);

      // todo react on different message types
      socket.broadcast.emit("response", message);
    });
  }
});

const PORT = process.env.PORT || 5000;

server.app.listen({ port: PORT }, () =>
  console.log(`> 🚀 Listening on port ${PORT}`)
);

// ((port = process.env.APP_PORT || 5000) => {
//   http.listen(port, () => console.log(`> Listening on port ${port}`));
// })();
