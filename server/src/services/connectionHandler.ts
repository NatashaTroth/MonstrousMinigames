import User from "../classes/user";
import RoomService from "./roomService";
import { ObstacleReachedInfo, PlayerFinishedInfo } from "../gameplay/catchFood/interfaces";
import GameEventEmitter from "../classes/GameEventEmitter";
import { CatchFoodMsgType } from "../gameplay/catchFood/interfaces/CatchFoodMsgType";
import { GameEventTypes } from "../gameplay/interfaces/GameEventTypes";
import { Namespaces } from "../enums/nameSpaces";
import { MessageTypes } from "../enums/messageTypes";

const gameEventEmitter = GameEventEmitter.getInstance();
const rs = new RoomService();

function handleConnection(io: any) {
  const controllerNamespace = io.of(Namespaces.CONTROLLER);
  const screenNameSpace = io.of(Namespaces.SCREEN);

  handleControllers(io, controllerNamespace);
  handleScreens(io, screenNameSpace);

  handleGameEvents(io, controllerNamespace, screenNameSpace);
}

function handleControllers(io: any, controllerNamespace: any) {
  controllerNamespace.on("connection", function (socket: any) {
    let roomId = socket.handshake.query.roomId
      ? socket.handshake.query.roomId
      : "ABCDE";
    let room = rs.getRoomById(roomId);

    let name = socket.handshake.query.name;

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
      /** for now new user gets old user's id */
      if (!room.addUser(user)) {
        socket.emit("message", {
          type: "error",
          msg: "Cannot join. Game already started",
        });
        console.error("User tried to join. Game already started: " + userId);
        userId = room.users[0].id;
      }
    }
    console.log(roomId + " | Controller connected: " + userId);

    // send user data
    socket.emit("message", {
      type: MessageTypes.USER_INIT,
      userId: userId,
      roomId: roomId,
      name: name,
    });
    socket.join(roomId);

    socket.on("disconnect", () => {
      console.log(roomId + " | Controller disconnected: " + userId);
    });

    socket.on("message", function (message: any) {
      let type = message.type;

      switch (type) {
        case CatchFoodMsgType.START: {
          if (room.isOpen()) {
            rs.startGame(room);
            console.log(roomId + " | Start game");
            io.of(Namespaces.SCREEN).to(roomId).emit("message", {
              type: CatchFoodMsgType.HAS_STARTED,
            });
            io.of(Namespaces.SCREEN).to(roomId).emit("message", {
              type: CatchFoodMsgType.GAME_STATE,
              data: room.game?.getGameStateInfo(),
            });
            // TODO gamestate interval?
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
        case CatchFoodMsgType.OBSTACLE_SOLVED: {
          room.game?.playerHasCompletedObstacle(userId);
          io.of(Namespaces.SCREEN).to(roomId).emit("message", {
            type: CatchFoodMsgType.GAME_STATE,
            data: room.game?.getGameStateInfo(),
          });
          break;
        }
        case MessageTypes.RESET_GAME:
          {
            console.log(roomId + " | Reset Game");
            room.users = [new User(room.id, socket.id, name, userId)];
            room.resetGame();
          }
          break;
        default: {
          console.log(message);
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
    console.log(roomId + " | Screen connected");
    // Todo user initialisation

    socket.on("disconnect", () => {
      console.log(roomId + " | Screen disconnected");
    });

    socket.on("message", function (message: any) {
      console.log(message);

      // todo react on different message types
      socket.broadcast.emit("message", message);
    });
  });
}
function handleGameEvents(
  io: any,
  controllerNamespace: any,
  screenNameSpace: any
) {
  gameEventEmitter.on(
    GameEventTypes.ObstacleReached,
    (data: ObstacleReachedInfo) => {
      console.log(
        data.roomId +
          " | userId: " +
          data.userId +
          " | Obstacle: " +
          data.obstacleType
      );
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
  gameEventEmitter.on(
    GameEventTypes.PlayerHasFinished,
    (data: PlayerFinishedInfo) => {
      console.log(
        data.roomId +
          " | userId: " +
          data.userId +
          " | Rank: " +
          data.rank
      );
      let r = rs.getRoomById(data.roomId);
      let u = r.getUserById(data.userId);
      if (u) {
        controllerNamespace.to(u.socketId).emit("message", {
          type: CatchFoodMsgType.PLAYER_FINISHED,
          rank: data.rank
        });
      }
    }
  );
}

export = {
  handleConnection,
};
