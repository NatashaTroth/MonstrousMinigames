import Room from "../classes/room";

class RoomService {
  private rooms: Array<Room>;

  constructor() {
    this.rooms = [];
  }

  public createRoom(roomId: string = "ABCDE") {
    let room = new Room(roomId);
    this.rooms.push(room);
    return room;
  }

  public getRoomById(roomId: string) {
    let room = this.rooms.filter(function (n) {
      return n.id === roomId;
    })[0];
    if (!room) return this.createRoom(roomId);
    return room;
  }

  public startGame(room: Room){
      room.createGame()
  }
}
export default RoomService;
