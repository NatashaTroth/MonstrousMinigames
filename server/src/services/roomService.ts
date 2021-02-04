import Room from "../classes/room";

class RoomService {
  private rooms: Array<Room>;

  constructor() {
    this.rooms = [];
  }

  private createRoom(roomId: string = "ABCDE") {
    let room = new Room(roomId);
    this.rooms.push(room);
    return room;
  }

  /** gets the room by the given id or creates a new room with the id */
  public getRoomById(roomId: string) {
    let room = this.rooms.filter(function (n) {
      return n.id === roomId;
    })[0];
    if (!room) {
      console.log('RS | Create Room: ' + roomId);
      return this.createRoom(roomId);
    }
    return room;
  }
  /** starts the game in the room and returns the initial game state */
  public startGame(room: Room) {
    room.createGame();
    return room.game?.getGameStateInfo();
  }
}
export default RoomService;
