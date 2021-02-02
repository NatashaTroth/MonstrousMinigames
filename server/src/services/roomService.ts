import Room from "../classes/room";

class RoomService {
  private rooms: Array<Room>;

  constructor() {
    this.rooms = [];
  }

  public createRoom() {
    let room = new Room();
    this.rooms.push(room);
    return room;
  }

  public getRoomById(roomId: string) {
    console.log(roomId);
    return this.rooms.filter(function (n) {
      return n.id === roomId;
    })[0];
  }
}
export default RoomService;
