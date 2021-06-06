import shortid from 'shortid';

class User {
    public id: string;
    public roomId: string;
    public socketId: string;
    public name: string;
    public timestamp: number;
    public active: boolean;
    public number: number;
    public characterNumber: number;

    constructor(
        roomId: string,
        socketId: string,
        name: string,
        characterNumber = -1,
        id: string = shortid.generate(),
        number = 0
    ) {
        this.id = id;
        this.roomId = roomId;
        this.socketId = socketId;
        this.name = name;
        this.timestamp = Date.now();
        this.active = true;
        this.number = number;
        this.characterNumber = characterNumber;
    }

    public setRoomId(id: string): void {
        this.roomId = id;
    }

    public setSocketId(id: string): void {
        this.socketId = id;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public updateTimestamp(): void {
        this.timestamp = Date.now();
    }

    public setActive(active: boolean): void {
        this.active = active;
    }

    public setNumber(number: number) {
        this.number = number;
    }

    public setCharacterNumber(number: number) {
        this.characterNumber = number;
    }

    public clear() {
        this.id = '';
        this.roomId = '';
        this.name = '';
        this.socketId = '';
        this.active = false;
    }
}

export default User;
