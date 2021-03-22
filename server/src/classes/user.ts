import shortid from "shortid";

class User {
  public id: string;
  public roomId: string;
  public socketId: string;
  public name: string;
  public timestamp: number;

  constructor(
    roomId: string,
    socketId: string,
    name: string,
    id: string = shortid.generate()
  ) {
    this.id = id;
    this.roomId = roomId;
    this.socketId = socketId;
    this.name = name;
    this.timestamp = Date.now();
  }

  public setRoomId(id: string) {
    this.roomId = id;
  }

  public setSocketId(id: string) {
    this.socketId = id;
  }

  public setName(name: string) {
    this.name = name;
  }

  public updateTimestamp() {
    this.timestamp = Date.now();
  }
}

export default User;
