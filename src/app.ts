import dotenv from "dotenv";
import express from "express";
const cors = require("cors");

// load the environment variables from the .env file
dotenv.config({
  path: ".env",
});

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class Server {
  public app = express();
}

// initialize server app
const server = new Server();
const http = require("http").Server(server.app);

const io = require("socket.io")(http, {
  cors: {
    origin: ["http://localhost:5050", "http://127.0.0.1:5500"],
    methods: ["GET", "POST"],
  },
});

server.app.get("/", (req, res) => {
  res.send("GAAAAME");
});

io.on("connection", function (socket: any) {
  console.log("Client connected");
  console.log(socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("message", function (message: any) {
    console.log(message);
    // todo react on different message types
    socket.broadcast.emit("response", message);
  });
});

const PORT = process.env.PORT || 5000;

server.app.listen({ port: PORT }, () =>
  console.log(`> 🚀 Listening on port ${PORT}`)
);

// ((port = process.env.APP_PORT || 5000) => {
//   http.listen(port, () => console.log(`> Listening on port ${port}`));
// })();
