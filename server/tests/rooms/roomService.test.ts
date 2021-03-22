import RoomService from "../../src/services/roomService";

describe("RoomService", () => {
    it("creates a roomService with 20 roomCodes", () => {
        const count = 20;
        const roomService = new RoomService(count);

        console.log('roomcodes')
        console.log(roomService.roomCodes)
        expect(roomService.roomCodes.length).toEqual(count);
    })
    it("creates two rooms with different ids", () => {
        const roomService = new RoomService(100);
        const firstRoom = roomService.createRoom();
        const secondRoom = roomService.createRoom();
        console.log(firstRoom.id)
        expect(firstRoom.id).not.toEqual(secondRoom.id);
    })

});


