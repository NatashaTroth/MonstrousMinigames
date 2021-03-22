import User from "../classes/user";
import RoomService from "./roomService";
import {
  ObstacleReachedInfo,
  PlayerFinishedInfo,
} from "../gameplay/catchFood/interfaces";
import GameEventEmitter from "../classes/GameEventEmitter";
import { CatchFoodMsgType } from "../gameplay/catchFood/interfaces/CatchFoodMsgType";
import { GameEventTypes } from "../gameplay/interfaces/GameEventTypes";
import { Namespaces } from "../enums/nameSpaces";
import { MessageTypes } from "../enums/messageTypes";
import { Server, Namespace } from "socket.io";
import emitter from "../helpers/emitter";

class ConnectionHandler {
  private io: Server;
  private gameEventEmitter: GameEventEmitter;
  private rs: RoomService;
  private controllerNamespace: Namespace;
  private screenNameSpace: Namespace;

  constructor(io: Server, rs: RoomService) {
    this.io = io;
    this.gameEventEmitter = GameEventEmitter.getInstance();
    this.rs = rs;
    this.controllerNamespace = this.io.of(Namespaces.CONTROLLER);
    this.screenNameSpace = this.io.of(Namespaces.SCREEN);
  }

  public handle(): void {
    this.handleControllers();
    this.handleScreens();
    this.handleGameEvents();
  }
  private handleControllers() {
    const rs = this.rs;
    const controllerNamespace = this.controllerNamespace;

    const screenNameSpace = this.screenNameSpace;
    this.controllerNamespace.on("connection", function (socket: any) {
      const roomId = socket.handshake.query.roomId;
      const room = rs.getRoomById(roomId);
      const name = socket.handshake.query.name;
      let user: User;

      let userId = socket.handshake.query.userId;
      if (userId) {
        user = room.getUserById(userId);
        if (user) {
          user.setRoomId(roomId);
          user.setSocketId(socket.id);
        } else {
          user = new User(room.id, socket.id, name);
          userId = user.id;

          if (!room.addUser(user)) {
            emitter.sendErrorMessage(
              socket,
              "Cannot join. Game already started"
            );
            console.error(
              "User tried to join. Game already started: " + userId
            );
            //userId = room.users[0].id;
            return;
          }
        }
      } else {
        user = new User(room.id, socket.id, name);
        userId = user.id;

        if (!room.addUser(user)) {
          emitter.sendErrorMessage(socket, "Cannot join. Game already started");
          console.error("User tried to join. Game already started: " + userId);
          //userId = room.users[0].id;
          return;
        }
      }
      emitter.sendConnectedUsers(screenNameSpace, room);
      console.log(roomId + " | Controller connected: " + userId);

      emitter.sendUserInit(socket, user, room);

      socket.join(roomId);

      socket.on("disconnect", () => {
        console.log(roomId + " | Controller disconnected: " + userId);
      });

      socket.on("message", function (message: any) {
        const type = message.type;

        switch (type) {
          case CatchFoodMsgType.START: {
            if (room.isOpen()) {
              rs.startGame(room);
              console.log(roomId + " | Start game");

              emitter.sendGameHasStarted(
                [controllerNamespace, screenNameSpace],
                room
              );
              emitter.sendGameState(screenNameSpace, room);

              const gameStateInterval = setInterval(() => {
                if (!room.isPlaying) {
                  clearInterval(gameStateInterval);
                }
                emitter.sendGameState(screenNameSpace, room, true);
              }, 100);
            }

            break;
          }
          case CatchFoodMsgType.MOVE: {
            if (room.isPlaying()) {
              room.game?.runForward(userId, 1);
              //emitter.sendGameState(screenNameSpace, room, true)
            }
            break;
          }
          case CatchFoodMsgType.OBSTACLE_SOLVED: {
            room.game?.playerHasCompletedObstacle(userId);
            //emitter.sendGameState(screenNameSpace, room, true)
            break;
          }
          case MessageTypes.RESET_GAME:
            {
              if (room.isAdmin(user)) {
                console.log(roomId + " | Reset Game");
                room.resetGame(user).then(() => {
                  emitter.sendUserInit(socket, user, room);
                });
              }
            }
            break;
          default: {
            console.log(message);
          }
        }
      });
    });
  }
  private handleScreens() {
    const rs = this.rs;
    const screenNameSpace = this.screenNameSpace;

    this.screenNameSpace.on("connection", function (socket: any) {
      const roomId = socket.handshake.query.roomId
        ? socket.handshake.query.roomId
        : "ABCDE";
      const room = rs.getRoomById(roomId);

      socket.join(room.id);
      console.log(roomId + " | Screen connected");

      emitter.sendConnectedUsers(screenNameSpace, room);

      socket.on("disconnect", () => {
        console.log(roomId + " | Screen disconnected");
      });

      socket.on("message", function (message: any) {
        console.log(message);

        socket.broadcast.emit("message", message);
      });
    });
  }
  private handleGameEvents() {
    const rs = this.rs;
    const controllerNamespace = this.controllerNamespace;
    const screenNameSpace = this.screenNameSpace;
    this.gameEventEmitter.on(
      GameEventTypes.ObstacleReached,
      (data: ObstacleReachedInfo) => {
        console.log(
          data.roomId +
            " | userId: " +
            data.userId +
            " | Obstacle: " +
            data.obstacleType
        );
        const r = rs.getRoomById(data.roomId);
        const u = r.getUserById(data.userId);
        if (u) {
          this.controllerNamespace.to(u.socketId).emit("message", {
            type: CatchFoodMsgType.OBSTACLE,
            obstacleType: data.obstacleType,
          });
        }
      }
    );
    this.gameEventEmitter.on(
      GameEventTypes.PlayerHasFinished,
      (data: PlayerFinishedInfo) => {
        console.log(
          data.roomId + " | userId: " + data.userId + " | Rank: " + data.rank
        );
        const room = rs.getRoomById(data.roomId);
        const user = room.getUserById(data.userId);
        if (user) {
          emitter.sendPlayerFinished(controllerNamespace, user, data);
        }
      }
    );
    this.gameEventEmitter.on(GameEventTypes.GameHasFinished, (data: any) => {
      console.log(data.roomId + " | Game has finished");
      const room = rs.getRoomById(data.roomId);
      room.setClosed();
      emitter.sendGameHasFinished([controllerNamespace, screenNameSpace], data);
    });
  }
}

export default ConnectionHandler;
