import { StringDecoder } from "string_decoder";
import { v4 as uuidv4 } from "uuid";

class User {
  public id: string;
  public roomId: string;
  public name: string;
  public timestamp: number;

  constructor(roomId: string, name: string) {
    this.id = uuidv4();
    this.roomId = roomId;
    this.name = name;
    this.timestamp = Date.now();
  }

  public setRoomId(roomId: string) {
    this.roomId = roomId;
  }

  public setName(name: string) {
    this.name = name;
  }

  public updateTimestamp() {
    this.timestamp = Date.now();
  }
}

export default User;
