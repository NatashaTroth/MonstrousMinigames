import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import client from 'socket.io-client';

import { GameAlreadyStartedError, InvalidRoomCodeError } from '../../src/customErrors/';
import emitter from '../../src/helpers/emitter';
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
        receiver.close();
        jest.clearAllMocks();
        done();
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

        done();
    });
    it('should send a message of type userinit with the given username on connection', done => {
        const username = 'John';

        receiver = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });

        receiver.on('message', (msg: any) => {
            expect(msg.type).toEqual('userInit');
            expect(msg.name).toEqual(username);
            done();
        });
    });
    it('should send an error message if a user tries to join a nonexistent room', done => {
        const username = 'John';
        roomCode = 'INVALID';

        receiver = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        receiver.on('message', (msg: any) => {
            expect(msg.type).toEqual('error');
            done();
        });
    });
    it('should log InvalidRoomCodeError if a user tries to join a nonexistent room', done => {
        const username = 'John';
        roomCode = 'INVALID';
        const consoleSpy = jest.spyOn(console, 'error');

        receiver = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        receiver.on('message', (msg: any) => {
            expect(msg.type).toEqual('error');
            expect(msg.name).toEqual(InvalidRoomCodeError.name);
            expect(consoleSpy).toHaveBeenCalledWith(`${roomCode} | ${InvalidRoomCodeError.name}`);
            done();
        });
    });
    it('should add a user to the room after joining', done => {
        const username = 'John';

        receiver = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        receiver.on('message', (msg: any) => {
            const room = rs.getRoomById(roomCode);
            const user = room.users[0];
            expect(user.id).toEqual(msg.userId);
            done();
        });
    });

    it('should allow a user to rejoin after disconnecting', done => {
        const username = 'John';

        receiver = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        receiver.on('message', (msg: any) => {
            const userId = msg.userId;
            const room = rs.getRoomById(roomCode);
            const user = room.getUserById(userId);

            expect(user.id).toEqual(msg.userId);
            expect(user.socketId).toEqual(receiver.id);
            expect(user.active).toEqual(true);

            const receiver2 = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=${userId}`, {
                secure: true,
                reconnection: true,
                rejectUnauthorized: false,
                reconnectionDelayMax: 5000,
            });
            receiver2.on('message', (msg: any) => {
                expect(user.id).toEqual(msg.userId);
                expect(user.socketId).toEqual(receiver2.id);
                expect(user.active).toEqual(true);

                receiver2.close();
                done();
            });
        });
    });

    it('should call the addUser method in room after a user joins without an id', done => {
        const username = 'John';
        const room = rs.getRoomById(roomCode);
        const spy = jest.spyOn(room, 'addUser');

        receiver = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        receiver.on('message', (msg: any) => {
            const user = room.users[0];
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(user);
            done();
        });
    });

    it('should send and log GameAlreadyStartedError if new user joins a started game', done => {
        const username = 'John';
        const room = rs.getRoomById(roomCode);
        const emitterSpy = jest.spyOn(emitter, 'sendErrorMessage');
        const consoleSpy = jest.spyOn(console, 'error');

        room.setPlaying();

        receiver = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        receiver.on('message', (msg: any) => {
            expect(msg.type).toEqual('error');
            expect(msg.name).toEqual(GameAlreadyStartedError.name);
            expect(emitterSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith(`${roomCode} | ${GameAlreadyStartedError.name}`);
            done();
        });
    });

    it('should send and log GameAlreadyStartedError if new user joins a started game', done => {
        const username = 'John';
        const room = rs.getRoomById(roomCode);
        const emitterSpy = jest.spyOn(emitter, 'sendErrorMessage');
        const consoleSpy = jest.spyOn(console, 'error');

        room.setPlaying();

        receiver = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        receiver.on('message', (msg: any) => {
            expect(emitterSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith(`${roomCode} | ${GameAlreadyStartedError.name}`);
            done();
        });
    });

    it('should send a connectedUsers message to screens if controller joins', done => {
        const username = 'John';
        const emitterSpy = jest.spyOn(emitter, 'sendConnectedUsers');

        receiver = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });

        receiver.on('message', (msg: any) => {
            expect(emitterSpy).toHaveBeenCalledTimes(1);

            done();
        });
    });
});
