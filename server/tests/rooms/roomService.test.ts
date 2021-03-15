import RoomService from "../../src/services/roomService";

describe("RoomService", () => {
    it("creates two rooms with different ids", () => {
        const roomService = new RoomService();
        let firstRoom = roomService.createRoom();
        let secondRoom = roomService.createRoom();
        console.log(firstRoom.id)
        expect(firstRoom.id).not.toEqual(secondRoom.id);
    })
});


