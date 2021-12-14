import 'reflect-metadata';

import User from '../../src/classes/user';
import NoRoomCodeAvailableError from '../../src/customErrors/NoRoomCodeAvailableError';
import { Globals } from '../../src/enums/globals';
import RoomService from '../../src/services/roomService';


describe('RoomService', () => {
    let rs: RoomService;

    beforeEach(done => {
        rs = new RoomService(5);
        done();
    });
    afterAll(async () => {
        await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
      });

    it('should create a roomService with 20 roomCodes', () => {
        const count = 2;
        const roomService = new RoomService(count);
        expect(roomService.roomCodes.length).toEqual(count);
    });
    it('should create two rooms with different ids', () => {
        const firstRoom = rs.createRoom();
        const secondRoom = rs.createRoom();
        expect(firstRoom.id).not.toEqual(secondRoom.id);
    });
    it('should reuse roomId after room is deleted', () => {
        const room = rs.createRoom();
        const roomId = room.id;
        rs.removeRoom(room.id);
        expect(rs.roomCodes).toContain(roomId);
    });
    it('should clear user when a room is deleted', () => {
        const room = rs.createRoom();
        const user = new User(room.id, '1', 'Robert');
        room.addUser(user);
        rs.removeRoom(room.id);
        expect(user.roomId).toBeFalsy;
    });

    it('should clear user when a room is deleted', () => {
        const room = rs.createRoom();
        const user = new User(room.id, '1', 'Robert');
        room.addUser(user);
        rs.removeRoom(room.id);
        expect(user.roomId).toBeFalsy;
    });

    it('should reuse the room code after it was closed and closed rooms were cleared', () => {
        const room = rs.createRoom();
        for (let i = 1; i < 5; i++) {
            rs.createRoom()
        }
        room.setClosed()
        rs.cleanupRooms()
        expect([room.id]).toEqual(rs.roomCodes);
    });

    it(`should remove rooms that are older than ${Globals.ROOM_TIME_OUT_HOURS} hours`, () => {
        const room = rs.createRoom();
        room.timestamp = Date.now() - ((Globals.ROOM_TIME_OUT_HOURS * 360000) + 1)
        rs.cleanupRooms()
        expect(rs.roomCodes).toContain(room.id)
    });

    it(`should not close rooms that are not older than ${Globals.ROOM_TIME_OUT_HOURS} hours`, () => {
        const room = rs.createRoom();

        room.timestamp = Date.now() - ((Globals.ROOM_TIME_OUT_HOURS - 1) * 360000)
        rs.cleanupRooms()
        expect(rs.roomCodes).not.toContain(room.id)
    });

    it('startGame should return a gameState with roomId', () => {
        const room = rs.createRoom();
        const user = new User(room.id, '1', 'Robert');
        user.setReady(true)
        room.addUser(user);
        expect(rs.startGame(room)?.roomId).toEqual(room.id);
    });

    it('should throw a NoRoomCodeAvailableError if it runs out of roomcodes', () => {
        for (let i = 0; i < 5; i++)  rs.createRoom();
        expect(() => rs.createRoom()).toThrowError(NoRoomCodeAvailableError);
    });
});
