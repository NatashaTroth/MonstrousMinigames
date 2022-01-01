import { inject, singleton } from 'tsyringe';

import { InvalidRoomCodeError } from '../customErrors';
import { DI_ROOM_NUMBER } from '../di';
import Room from '../classes/room';
import NoRoomCodeAvailableError from '../customErrors/NoRoomCodeAvailableError';
import { Globals } from '../enums/globals';
import { IGameStateBase } from '../gameplay/interfaces/IGameStateBase';

const CodeGenerator = require('node-code-generator');
const generator = new CodeGenerator();

@singleton()
class RoomService {
    private rooms: Array<Room>;
    public roomCodes: Array<string>;

    constructor(@inject(DI_ROOM_NUMBER) roomCount: number) {
        this.rooms = [];
        this.roomCodes = generator.generateCodes('****', roomCount, {
            alphanumericChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        });
    }

    public createRoom(): Room {
        const room = new Room(this.getSingleRoomCode());
        this.rooms.push(room);
        return room;
    }

    /** gets the room by the given id or creates a new room with the id */
    public getRoomById(roomId: string): Room {
        const room = this.rooms.filter(function (n) {
            return n.id === roomId.toUpperCase();
        })[0];
        if (!room) {
            throw new InvalidRoomCodeError();
        }
        return room;
    }
    /** starts the game in the room and returns the initial game state */
    public startGame(room: Room): IGameStateBase {
        room.createNewGame();
        room.startGame();
        return room.game.getGameStateInfo();
    }

    private getSingleRoomCode(): string {
        const roomCode = this.roomCodes.pop();
        if (!roomCode) throw new NoRoomCodeAvailableError();
        return roomCode;
    }

    public removeRoom(roomId: string): void {
        const room = this.getRoomById(roomId);
        const index = this.rooms.indexOf(room);
        this.rooms.splice(index, 1);
        room.clear();
        this.roomCodes.unshift(room.id);
    }
    public cleanupRooms(): void {
        const closedRooms = this.rooms.filter((room: Room) => {
            return room.isClosed() || Date.now() - room.timestamp > Globals.ROOM_TIME_OUT_HOURS * 360000;
        });
        closedRooms.forEach((room: Room) => {
            this.removeRoom(room.id);
        });
    }
}

export default RoomService;
