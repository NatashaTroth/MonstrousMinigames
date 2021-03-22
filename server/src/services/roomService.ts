import Room from "../classes/room";
const CodeGenerator = require("node-code-generator");
const generator = new CodeGenerator();

class RoomService {
  private rooms: Array<Room>;
  public roomCodes: Array<string>;

  constructor(roomCount: integer) {
    this.rooms = [];
    this.roomCodes = generator.generateCodes("****", roomCount);
  }

  public createRoom(roomId: any = this.getSingleRoomCode()) {
    const room = new Room(roomId);
    this.rooms.push(room);
    return room;
  }

  /** gets the room by the given id or creates a new room with the id */
  public getRoomById(roomId: string) {
    const room = this.rooms.filter(function (n) {
      return n.id === roomId;
    })[0];
    if (!room) {
      console.log("RS | Create Room: " + roomId);
      return this.createRoom(roomId);
    }
    return room;
  }
  /** starts the game in the room and returns the initial game state */
  public startGame(room: Room) {
    room.createGame();
    return room.game?.getGameStateInfo();
  }

  public getSingleRoomCode() {
    return this.roomCodes.pop();
  }
}
export default RoomService;
