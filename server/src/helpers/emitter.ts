import { Namespace } from "socket.io";
import Room from "../classes/room";
import User from "../classes/user";
import { MessageTypes } from "../enums/messageTypes";
import { CatchFoodMsgType } from "../gameplay/catchFood/interfaces/CatchFoodMsgType";

function sendUserInit(socket: any, user: User, room: Room) {
  socket.emit("message", {
    type: MessageTypes.USER_INIT,
    userId: user.id,
    roomId: room.id,
    name: user.name,
    isAdmin: room.isAdmin(user),
  });
}
function sendGameState(
  namespace: Namespace,
  room: Room,
  volatile: boolean = false
) {
  if (volatile) {
    namespace.to(room.id).volatile.emit("message", {
      type: CatchFoodMsgType.GAME_STATE,
      data: room.game?.getGameStateInfo(),
    });
  } else {
    namespace.to(room.id).emit("message", {
      type: CatchFoodMsgType.GAME_STATE,
      data: room.game?.getGameStateInfo(),
    });
  }
}
function sendErrorMessage(socket: any, message: string) {
  socket.emit("message", {
    type: "error",
    msg: message,
  });
}
function sendGameHasStarted(namespaces: Array<Namespace>, room: Room) {
  namespaces.forEach(function (namespace: Namespace) {
    namespace.to(room.id).emit("message", {
      type: CatchFoodMsgType.HAS_STARTED,
    });
  });
}
function sendGameHasFinished(namespaces: Array<Namespace>, data: any) {
  namespaces.forEach(function (namespace: Namespace) {
    namespace.to(data.roomId).emit("message", {
      type: MessageTypes.GAME_HAS_FINISHED,
      data: data,
    });
  });
}

function sendPlayerFinished(io: any, user: User, data: any) {
  io.to(user.socketId).emit("message", {
    type: CatchFoodMsgType.PLAYER_FINISHED,
    rank: data.rank,
  });
}

export default {
  sendUserInit,
  sendGameState,
  sendErrorMessage,
  sendGameHasStarted,
  sendPlayerFinished,
  sendGameHasFinished,
};
