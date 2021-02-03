import User from "../classes/user";
import RoomService from "./roomService";
import { ObstacleReachedInfo } from "../gameplay/catchFood/interfaces";
import GameEventEmitter from "../classes/GameEventEmitter";
import { MessageTypes, Namespaces } from "../interfaces/enums";
import { CatchFoodMsgType } from "../gameplay/catchFood/interfaces/CatchFoodMsgType";
import { GameEventTypes } from "../gameplay/interfaces/GameEventTypes";

const gameEventEmitter = GameEventEmitter.getInstance();
const rs = new RoomService();

function handleConnection(io: any) {
  const controllerNamespace = io.of(Namespaces.CONTROLLER);
  const screenNameSpace = io.of(Namespaces.SCREEN);

  handleControllers(io, controllerNamespace);
  handleScreens(io, screenNameSpace);

  gameEventEmitter.on(
    GameEventTypes.ObstacleReached,
    (data: ObstacleReachedInfo) => {
      console.log(data);
      let r = rs.getRoomById(data.roomId);
      let u = r.getUserById(data.userId);
      if (u) {
        controllerNamespace.to(u.socketId).emit("message", {
          type: CatchFoodMsgType.OBSTACLE,
          obstacleType: data.obstacleType,
        });
      }
    }
  );
}

function handleControllers(io: any, controllerNamespace: any) {
  controllerNamespace.on("connection", function (socket: any) {
    let roomId = socket.handshake.query.roomId
      ? socket.handshake.query.roomId
      : "ABCDE";
    let room = rs.getRoomById(roomId);

    let name = socket.handshake.query.name
      ? socket.handshake.query.name
      : "Reinhold";

    let userId = socket.handshake.query.userId;
    if (userId) {
      let user = room.getUserById(userId);
      if (user) {
        user.setRoomId(roomId);
        user.setSocketId(socket.id);
      }
    } else {
      let user = new User(room.id, socket.id, name);
      userId = user.id;
      if (!room.addUser(user)) {
        socket.emit("message", { type: "error" });
        return;
      }
    }
    console.log("Room: " + roomId + " | Controller connected: " + userId);

    // send user data
    socket.emit("message", {
      type: MessageTypes.USER_INIT,
      userId: userId,
      roomId: roomId,
      name: name,
    });
    socket.join(roomId);

    socket.on("disconnect", () => {
      console.log("Controller disconnected");
    });

    socket.on("message", function (message: any) {
      let type = message.type;

      switch (type) {
        case CatchFoodMsgType.START: {
          if (!room.game) {
            rs.startGame(room);
            console.log("start game - roomId: " + roomId);
            io.of(Namespaces.SCREEN).to(roomId).emit("message", {
              type: CatchFoodMsgType.HAS_STARTED,
            });
            /*setInterval(() => {
              io.of(Namespaces.SCREEN).to(roomId).emit("message", {
                type: CatchFoodMsgType.GAME_STATE,
                data: room.game?.getGameStateInfo(),
              });
            }, 100000);*/
          }

          break;
        }
        case CatchFoodMsgType.MOVE: {
          room.game?.movePlayer(userId, 200);
          io.of(Namespaces.SCREEN).to(roomId).emit("message", {
            type: CatchFoodMsgType.GAME_STATE,
            data: room.game?.getGameStateInfo(),
          });
          break;
        }
        default: {
          console.log(message);

          socket.broadcast.emit("message", message);
        }
      }
    });
  });
}

function handleScreens(io: any, screenNameSpace: any) {
  screenNameSpace.on("connection", function (socket: any) {
    let roomId = socket.handshake.query.roomId
      ? socket.handshake.query.roomId
      : "ABCDE";
    let room = rs.getRoomById(roomId);

    socket.join(room.id);
    console.log("Room: " + roomId + " | Screen connected");
    // Todo user initialisation

    socket.on("disconnect", () => {
      console.log("Screen disconnected");
    });

    socket.on("message", function (message: any) {
      console.log(message);

      // todo react on different message types
      socket.broadcast.emit("message", message);
    });
  });
}

export = {
  handleConnection,
};
