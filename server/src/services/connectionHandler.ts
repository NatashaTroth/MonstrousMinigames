import User from "../classes/user";
import RoomService from "./roomService";
import { ObstacleReachedInfo } from "../gameplay/catchFood/interfaces";
import GameEventEmitter from "../classes/GameEventEmitter";

const gameEventEmitter = GameEventEmitter.getInstance();

function handleConnection(io: any) {
  const rs = new RoomService();
  console.log(rs);

  io.on("connection", function (socket: any) {
    let roomId = socket.handshake.query.roomId
      ? socket.handshake.query.roomId
      : "ABCDE";
    let room = rs.getRoomById(roomId);

    if (socket.handshake.query.type === "controller") {
      // params name, userId

      let name = socket.handshake.query.name
        ? socket.handshake.query.name
        : "Reinhold";

      let userId = socket.handshake.query.name;
      if (userId) {
        let user = room.getUserById(userId);
        if (user) {
          user.setRoomId(roomId);
          user.setSocketId(socket.id);
          room.addUser(user);
        }
      } else {
        let user = new User(room.id, socket.id, name);
        userId = user.id;
        room.addUser(user);
      }

      console.log("Room: " + roomId + " | Controller connected: " + userId);

      // send user data
      socket.emit("message", {
        type: "userInit",
        userId: userId,
        roomId: roomId,
        name: name,
      });
      socket.join(roomId);

      socket.on("disconnect", () => {
        console.log("Controller disconnected");
      });

      socket.on("message", function (message: any) {
        console.log(message);

        let type = message.type;

        switch (type) {
          case "game1/start": {
            if (!room.game) {
              let gameState = rs.startGame(room);
              io.to(roomId).emit("message", gameState);
              console.log("start game - roomId: " + roomId);
              setInterval(() => {
                io.to(roomId).emit("message", gameState);
              }, 100);
              gameEventEmitter.on(
                "obstacleReached",
                (data: ObstacleReachedInfo) => {
                  console.log(data);
                  let r = rs.getRoomById(data.roomId)
                  let u = r.getUserById(data.playerId)
                  if (u) {
                    io.to(u.socketId).emit('message', {type: 'game1/obstacle', obstacleType:data.type})
                  }

                }
              );
            }
            break;
          }
          case "game1/runForward": {
            room.game?.movePlayer(userId, 200);
            io.of("screen")
              .to(roomId)
              .emit("message", room.game?.getGameState());
            break;
          }
        }

        // todo react on different message types
        socket.broadcast.emit("response", message);
      });
    } else {
      // messages from the screen
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
}

export = {
  handleConnection,
};
