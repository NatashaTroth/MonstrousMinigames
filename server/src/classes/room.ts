import { v4 as uuidv4 } from "uuid";
import { CatchFoodGame } from "../gameplay";
import User from "./user";

class Room {
  public id: string;
  public users: Array<User>;
  public timestamp: number;
  public game: CatchFoodGame | null;
  public admin: User | null;
  

  constructor(id: string = "ABCDE") {
    this.id = id;
    this.users = [];
    this.timestamp = Date.now();
    this.game = null;
    this.admin = null;
  }

  public addUser(user: User) {
    if (this.users.length === 0) this.admin = user;
    this.users.push(user);
  }

  public updateTimestamp() {
    this.timestamp = Date.now();
  }

  public createGame() {
    this.game = new CatchFoodGame(this.users);
  }

  public getUserById(userId: string) {
    let user = this.users.filter(function (u) {
      return u.id === userId;
    });
    return user.length === 1 ? user[0] : false;
  }
}

export default Room;


export enum RoomStates {
  EMPTY,
  OPEN,
  GAME1,
  CLOSED
}