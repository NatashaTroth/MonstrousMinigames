import 'reflect-metadata';

import client from 'socket.io-client';
import axios from 'axios';

import initApp from '../../src/initApp';

const PORT = 4501;

const url = `localhost:${PORT}`;
let roomCode: string;
let controller: SocketIOClient.Socket;

const app = initApp(PORT);
app.run();

describe('App Tests:', () => {
    beforeEach(done => {
        console.log = jest.fn();
        console.info = jest.fn();
        done();
    });

    afterAll(done => {
        app.shutdown();
        done();
    });
    afterEach(async done => {
        jest.clearAllMocks();
        done();
    });

    beforeEach(async done => {
        roomCode = await axios.get(`http://${url}/create-room`).then(resp => {
            return resp.data ? resp.data.roomId : '1234';
        });
        done();
    });

    it('should get a room code on request', async done => {
        await axios.get(`http://${url}/create-room`).then(resp => {
            console.log('hi');
            expect(resp.data.roomId).not.toBeNull();
            done();
        });
    });
    it('should send a message of type userinit with the given username on connection', async done => {
        const username = 'John';

        controller = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });

        controller.on('message', (msg: any) => {
            if (msg.type === 'userInit') {
                expect(msg.name).toEqual(username);
                done();
            }
        });
    });
});
