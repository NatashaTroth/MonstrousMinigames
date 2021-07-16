import Room from '../classes/room';
import { InvalidRoomCodeError } from '../customErrors';
import { Globals } from '../enums/globals';
import Game from '../gameplay/Game';
import { IGameStateBase } from '../gameplay/interfaces/IGameStateBase';

const CodeGenerator = require('node-code-generator');
const generator = new CodeGenerator();

class RoomService {
    private rooms: Array<Room>;
    public roomCodes: Array<string>;

    constructor(roomCount: number) {
        this.rooms = [];
        this.roomCodes = generator.generateCodes('****', roomCount, { alphanumericChars: 'BCDFGHJKLMNPQRSTVWXYZ' });
    }

    public createRoom(roomId: string = this.getSingleRoomCode(), game?: Game): Room {
        const room = new Room(roomId, game);
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
    public startGame(room: Room): IGameStateBase | undefined {
        room.startGame();
        return room.game?.getGameStateInfo();
    }

    public getSingleRoomCode(): string {
        return this.roomCodes.pop() || 'XXXX';
    }

    public removeRoom(roomId: string): boolean {
        const room = this.getRoomById(roomId);
        if (room) {
            const index = this.rooms.indexOf(room);
            this.rooms.splice(index, 1);
            room.clear();
            this.roomCodes.unshift(room.id);
            return true;
        }
        return false;
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
