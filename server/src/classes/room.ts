import { CatchFoodGame } from "../gameplay";
import User from "./user";

class Room {
  public id: string;
  public users: Array<User>;
  public timestamp: number;
  public game: CatchFoodGame | null;
  public admin: User | null;
  private state: RoomStates;

  constructor(id: string = "ABCDE") {
    this.id = id;
    this.users = [];
    this.timestamp = Date.now();
    this.game = null;
    this.admin = null;
    this.state = RoomStates.OPEN;
  }

  public addUser(user: User) {
    if (this.state === RoomStates.OPEN) {
      if (this.users.length === 0) this.admin = user;
      this.users.push(user);
      return true;
    }
    return false;
  }
  public isAdmin(user: User) {
    return user === this.admin;
  }

  public removeUser(toBeRemoved: User) {
    let index = this.users.indexOf(toBeRemoved);
    this.users.splice(index);
  }

  //TODO remove User, logic

  public updateTimestamp() {
    this.timestamp = Date.now();
  }

  public createGame() {
    this.setState(RoomStates.PLAYING);
    this.game = new CatchFoodGame(this.users);
    this.startGame();
  }

  private startGame() {
    if (this.game) {
      this.game.startGame();
    }
  }

  public getUserById(userId: string) {
    let user = this.users.filter(function (u) {
      return u.id === userId;
    });
    return user[0];
  }

  public async resetGame(user: User) {
    this.game?.resetGame(this.users);
    this.setState(RoomStates.OPEN);
    this.admin = user;
  }

  private setState(state: RoomStates) {
    this.state = state;
  }

  public isOpen() {
    return this.state === RoomStates.OPEN;
  }
  public isPlaying() {
    return this.state === RoomStates.PLAYING;
  }
  public isClosed() {
    return this.state === RoomStates.CLOSED;
  }
  public setClosed() {
    this.setState(RoomStates.CLOSED);
  }
}

export default Room;

export enum RoomStates {
  OPEN,
  PLAYING,
  CLOSED,
}
