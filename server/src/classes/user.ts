import shortid from 'shortid'

class User {
    public id: string
    public roomId: string
    public socketId: string
    public name: string
    public timestamp: number
    public active: boolean

    constructor(roomId: string, socketId: string, name: string, id: string = shortid.generate()) {
        this.id = id
        this.roomId = roomId
        this.socketId = socketId
        this.name = name
        this.timestamp = Date.now()
        this.active = true
    }

    public setRoomId(id: string): void {
        this.roomId = id
    }

    public setSocketId(id: string): void {
        this.socketId = id
    }

    public setName(name: string): void {
        this.name = name
    }

    public updateTimestamp(): void {
        this.timestamp = Date.now()
    }

    public setActive(active: boolean): void {
        this.active = active
    }
}

export default User
