import { v4 as uuidv4 } from "uuid";
import User from "./user";

class Room {
  public id: string;
  public users: Array<User>;
  public timestamp: number;

  constructor() {
    this.id = 'ABCDE';
    this.users = [];
    this.timestamp = Date.now();
  }

  public addUser(user: User) {
    this.users.push(user);
  }

  public updateTimestamp() {
    this.timestamp = Date.now();
  }
}

export default Room;
