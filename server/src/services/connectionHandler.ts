import User from "../classes/user";
import RoomService from "./roomService";

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
      console.log("Controller connected");

      let userId = socket.handshake.query.name
        ? socket.handshake.query.userId
        : "user1";
      let name = socket.handshake.query.name
        ? socket.handshake.query.name
        : "Reinhold";
      room.addUser(new User(userId, room.id, name));

      

      if (socket.handshake.query.userId) {
        // todo find user with id
      }

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
}




export = {
  handleConnection,
};
