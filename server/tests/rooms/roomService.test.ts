import RoomService from "../../src/services/roomService";

describe("RoomService", () => {
    it("creates a roomService with 20 roomCodes", () => {
        const count = 2;
        const roomService = new RoomService(count);
        expect(roomService.roomCodes.length).toEqual(count);
    })
    it("creates two rooms with different ids", () => {
        const roomService = new RoomService(1);
        const firstRoom = roomService.createRoom();
        const secondRoom = roomService.createRoom();
        expect(firstRoom.id).not.toEqual(secondRoom.id);
    })

});