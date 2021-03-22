import Room from "../../src/classes/room";
import User from "../../src/classes/user";


describe("Room", () => {
    it("creates a room with id 'ABCD'", () => {
        const room = new Room('ABCD');
        expect(room.id).toEqual('ABCD');
    })
    it("adds User to room and removes the User", () => {
        const room = new Room('ABCD');
        const user = new User(room.id, 'socketId', 'Robert')

        room.addUser(user);
        expect(room.users[0]).toEqual(user);
        expect(room.isAdmin(user)).toBeTruthy;
        room.removeUser(user);
        expect(room.users.length).toEqual(0);
    })

    it("has new admin if admin is removed", () => {
        const room = new Room('ABCD');
        const user = new User(room.id, '1', 'Robert')
        const user2 = new User(room.id, '2', 'Johannes')

        room.addUser(user);
        room.addUser(user2);

        expect(room.isAdmin(user)).toBeTruthy;
        room.removeUser(user);
        expect(room.isAdmin(user2)).toBeTruthy;
    })
});