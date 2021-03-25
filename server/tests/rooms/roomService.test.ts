import RoomService from '../../src/services/roomService'
import User from '../../src/classes/user'

describe('RoomService', () => {
    let rs: RoomService

    beforeEach(done => {
        rs = new RoomService(5)
        done()
    })

    it('should create a roomService with 20 roomCodes', () => {
        const count = 2
        const roomService = new RoomService(count)
        expect(roomService.roomCodes.length).toEqual(count)
    })
    it('should create two rooms with different ids', () => {
        const firstRoom = rs.createRoom()
        const secondRoom = rs.createRoom()
        expect(firstRoom.id).not.toEqual(secondRoom.id)
    })
    it('should reuse roomId after room is deleted', () => {
        const room = rs.createRoom()
        const roomId = room.id
        rs.removeRoom(room.id)
        expect(rs.roomCodes).toContain(roomId)
    })
    it('should clear user when a room is deleted', () => {
        const room = rs.createRoom()
        const user = new User(room.id, '1', 'Robert')
        room.addUser(user)
        rs.removeRoom(room.id)
        expect(user.roomId).toBeFalsy
    })
})
