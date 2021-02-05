import Room from "../classes/room";
import User from "../classes/user";
import { MessageTypes } from "../enums/messageTypes";

function sendUserInit(socket: any, user: User, room: Room) {
  socket.emit("message", {
    type: MessageTypes.USER_INIT,
    userId: user.id,
    roomId: room.id,
    name: user.name,
    isAdmin: room.isAdmin(user),
  });
}
 export default {
    sendUserInit
 }