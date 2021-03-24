import Room from '../../src/classes/room'
import User from '../../src/classes/user'

describe('Room ID', () => {
    it("creates a room with id 'ABCD'", () => {
        const room = new Room('ABCD')
        expect(room.id).toEqual('ABCD')
    })
})

describe('Room: Users', () => {
    let room: Room
    const roomId = 'ABCD'
    let user1: User
    let user2: User

    beforeEach(done => {
        room = new Room(roomId)
        user1 = new User(room.id, '1', 'Robert')
        user2 = new User(room.id, '2', 'Johannes')
        room.addUser(user1)
        room.addUser(user2)
        done()
    })
    it('should have one play after two users join and one leaves', () => {
        expect(room.users[0]).toEqual(user1)
        expect(room.isAdmin(user1)).toBeTruthy
        room.userDisconnected(user1.id)
        expect(room.users.length).toEqual(1)
    })

    it('should have new admin if admin disconnects', () => {
        expect(room.isAdmin(user1)).toEqual(true)
        room.userDisconnected(user1.id)
        expect(room.isAdmin(user2)).toEqual(true)
    })

    it('should close the room if all players leave during a game', () => {
        room.setPlaying()

        room.userDisconnected(user1.id)
        expect(room.isClosed()).toEqual(false)
        room.userDisconnected(user2.id)
        expect(room.isClosed()).toEqual(true)
    })
    it('should label a player inactive after leaving a running game', () => {
        room.setPlaying()

        room.userDisconnected(user1.id)
        expect(user1.active).toBeFalsy
    })


    it('should remove inactive players after room is restarted', () => {
        room.setPlaying()

        room.userDisconnected(user1.id)
    
        room.resetGame()

        expect(room.users).not.toContain(user1)
        
    })
})
