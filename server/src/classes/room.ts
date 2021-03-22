import { CatchFoodGame } from "../gameplay";
import User from "./user";

class Room {
  public id: string;
  public users: Array<User>;
  public timestamp: number;
  public game: CatchFoodGame | null;
  public admin: User | null;
  private state: RoomStates;

  constructor(id: string) {
    this.id = id;
    this.users = [];
    this.timestamp = Date.now();
    this.game = null;
    this.admin = null;
    this.state = RoomStates.OPEN;
  }

  public addUser(user: User): boolean {
    if (this.isOpen()) {
      if (this.users.length === 0) this.admin = user;
      this.users.push(user);
      return true;
    }
    return false;
  }
  public isAdmin(user: User): boolean {
    return user === this.admin;
  }

  public removeUser(toBeRemoved: User): void {
    const index = this.users.indexOf(toBeRemoved);
    this.users.splice(index);
    // if user is admin
    if (this.users.length !== 0) {
      if (this.isAdmin(toBeRemoved)) {
        this.admin = this.users[0];
      }
    }
  }

  public updateTimestamp(): void {
    this.timestamp = Date.now();
  }

  public createGame(): void {
    this.setState(RoomStates.PLAYING);
    this.game = new CatchFoodGame(this.users);
    this.startGame();
  }

  private startGame(): void {
    if (this.game) {
      this.game.startGame();
    }
  }

  public getUserById(userId: string): User {
    const user = this.users.filter(function (u) {
      return u.id === userId;
    });
    return user[0];
  }

  public async resetGame(user: User) {
    this.game?.resetGame(this.users);
    this.setState(RoomStates.OPEN);
    this.admin = user;
  }

  private setState(state: RoomStates): void {
    this.state = state;
  }

  public isOpen(): boolean {
    return this.state === RoomStates.OPEN;
  }
  public isPlaying(): boolean {
    return this.state === RoomStates.PLAYING;
  }
  public isClosed(): boolean {
    return this.state === RoomStates.CLOSED;
  }
  public setClosed(): void {
    this.setState(RoomStates.CLOSED);
  }
}

export default Room;

export enum RoomStates {
  OPEN,
  PLAYING,
  CLOSED,
}
