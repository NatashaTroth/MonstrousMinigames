import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import client from 'socket.io-client';

import ConnectionHandler from '../../src/services/connectionHandler';
import RoomService from '../../src/services/roomService';

dotenv.config({
    path: '.env',
});

const PORT = process.env.TEST_PORT || 5050;

describe('connectionHandler', () => {
    let io: Server;
    let rs: RoomService;
    let ch: ConnectionHandler;
    const url = `localhost:${PORT}`;
    let roomCode: string;
    let receiver: SocketIOClient.Socket;
    let server: any;

    const app = express();

    beforeAll(done => {
        server = require('http').Server(app);

        server.listen(PORT, () => done());
    });

    afterAll(done => {
        server.listening ? server.close(() => done()) : done();
    });
    afterEach(done => {
        receiver.close()
        done()
    });

    beforeEach(async done => {
        rs = new RoomService(10);
        roomCode = rs.createRoom()?.id;

        io = require('socket.io')(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
        ch = new ConnectionHandler(io, rs);
        ch.handle();

        done()
    });
    it('should send a message of type userinit with the given username on connection', () => {
        const username = 'John'

        receiver = client(`http://${url}/controller?roomId=${roomCode}&name=${username}userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        receiver.on('message', (msg: any) => {
            expect(msg.type).toEqual('userInit')
            expect(msg.name).toEqual(username)

        });
    });


});
