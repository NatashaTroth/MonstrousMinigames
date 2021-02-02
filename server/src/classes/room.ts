import { v4 as uuidv4 } from "uuid";
import { CatchFoodGame } from "../gameplay";
import User from "./user";

class Room {
  public id: string;
  public users: Array<User>;
  public timestamp: number;
  public game: CatchFoodGame|null;

  constructor(id: string = "ABCDE") {
    this.id = id;
    this.users = [];
    this.timestamp = Date.now();
    this.game = null;
  }

  public addUser(user: User) {
    this.users.push(user);
  }

  public updateTimestamp() {
    this.timestamp = Date.now();
  }

  public createGame() {
    this.game = new CatchFoodGame(this.users);
  }
}

export default Room;
