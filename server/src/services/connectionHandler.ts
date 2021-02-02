import User from "../classes/user";
import RoomService from "./roomService";

function handleConnection(io: any) {
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
}
export = {
    handleConnection
};
