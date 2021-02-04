import dotenv from "dotenv";
import express from "express";
import User from "./classes/user";
import connectionHandler from "./services/connectionHandler";
import RoomService from "./services/roomService";

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

server.app.get("/", (req, res) => {
  res.send("GAAAAME!");
});

const PORT = process.env.PORT || 5000;

const expresServer = server.app.listen({ port: PORT }, () =>
  console.log(`> 🚀 Listening on port ${PORT}`)
);

const io = require("socket.io")(expresServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  },
});

connectionHandler.handleConnection(io);
