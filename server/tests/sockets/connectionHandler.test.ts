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
    let expresServer;
    let socket: SocketIOClient.Socket;
    let server: HttpServer;

    class HttpServer {
        public app = express();
    }

    beforeAll(done => {
        server = new HttpServer();

        // const PORT = process.env.PORT || 5050
        expresServer = server.app.listen({ port: PORT });
        io = require('socket.io')(expresServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
        done();
    });

    afterAll(done => {
        server.app.removeAllListeners;
        server.app.delete;
        server.app.off;
        done();
    });

    beforeEach(async done => {
        console.info = jest.fn();
        console.error = jest.fn();

        rs = new RoomService(100);
        roomCode = rs.createRoom()?.id;

        ch = new ConnectionHandler(io, rs);
        ch.handle();

        socket = await client(`http://${url}/controller?roomId=${roomCode}&name=Robin&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 10000,
        });
        socket.on('connect', (msg: any) => {
            roomCode = rs.createRoom()?.id;

            done();
        });
    });

    it('should create a new room with the roomId the player used for connecting', () => {
        const cSocket = client(`http://${url}/controller?roomId=${roomCode}&name=Robin&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });

        cSocket.on('connect', (msg: any) => {
            const room = rs.getRoomById(roomCode);
            expect(room.id).toEqual(roomCode);
        });
    });

});
