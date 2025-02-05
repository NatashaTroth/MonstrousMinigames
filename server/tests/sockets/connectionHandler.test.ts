import 'reflect-metadata';

import dotenv from 'dotenv';

import express from 'express';

import client from 'socket.io-client';

import { Server as HttpServer } from 'http';

import GameEventEmitter from '../../src/classes/GameEventEmitter';
import { GlobalEventMessageEmitter } from '../../src/classes/GlobalEventMessageEmitter';
import Screen from '../../src/classes/Screen';
import Server from '../../src/classes/Server';
import SocketIOServer from '../../src/classes/SocketIOServer';
import { GameAlreadyStartedError, InvalidRoomCodeError } from '../../src/customErrors/';
import { MessageTypes } from '../../src/enums/messageTypes';
import emitter from '../../src/helpers/emitter';
import ConnectionHandler from '../../src/services/connectionHandler';
import RoomService from '../../src/services/roomService';
import { GameOneEventMessageEmitter } from '../../src/gameplay/gameOne/GameOneEventMessageEmitter';

dotenv.config({
    path: '.env',
});

const PORT = process.env.TEST_PORT || 5050;
let rs: RoomService;
let ch: ConnectionHandler;
const url = `localhost:${PORT}`;
let roomCode: string;
let controller: SocketIOClient.Socket;
let screen: SocketIOClient.Socket;
let gameEventEmitter: GameEventEmitter;

let server: HttpServer;
let socket: SocketIOServer;

const app = express();

describe('connectionHandler', () => {


    beforeEach(done => {
        server = new HttpServer(app);
        console.error = jest.fn();
        console.info = jest.fn();
        gameEventEmitter = new GameEventEmitter();

        server.listen(PORT, () => {
            rs = new RoomService(100);
            roomCode = rs.createRoom()?.id;
            socket = new SocketIOServer({
                httpServer: server,
                app: app,
            } as Server);
            ch = new ConnectionHandler(
                socket,
                rs,
                gameEventEmitter,
                [new GlobalEventMessageEmitter(gameEventEmitter), new GameOneEventMessageEmitter(gameEventEmitter)]
            );
            ch.handle();
            done();
        });
    });

    afterAll(async done => {
        app.removeAllListeners();
        client.Socket.removeAllListeners();
        ch.shutdown();
        server.removeAllListeners();
        server.listening ? server.close(() => done()) : done();

        done();

    });
    afterEach(async done => {
        controller.close();
        controller.removeAllListeners();
        if (screen) screen.close();
        if (screen) screen.removeAllListeners();
        gameEventEmitter.removeAllListeners();

        jest.clearAllMocks();
        jest.clearAllTimers();
        ch.shutdown();


        server.removeAllListeners();
        server.listening ? server.close(() => done()) : done();
        done();
    });

    beforeEach(done => {
        roomCode = rs.createRoom()?.id;
        done();
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
    it('should send an error message if a user tries to join a nonexistent room', async done => {
        const username = 'John';
        roomCode = 'INVALID';

        controller = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        controller.on('message', (msg: any) => {
            expect(msg.type).toEqual('error');
            done();
        });
    });
    it('should log InvalidRoomCodeError if a user tries to join a nonexistent room', async done => {
        const username = 'John';
        roomCode = 'INVALID';
        const consoleSpy = jest.spyOn(console, 'error');

        controller = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        controller.on('message', (msg: any) => {
            expect(msg.type).toEqual('error');
            expect(msg.name).toEqual(InvalidRoomCodeError.name);
            expect(consoleSpy).toHaveBeenCalledWith(`${roomCode} | Controller Error 1 | ${InvalidRoomCodeError.name}`);
            done();
        });
    });
    it('should add a user to the room after joining', async done => {
        const username = 'John';

        controller = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        controller.on('message', (msg: any) => {
            if (msg.type === 'userInit') {
                const room = rs.getRoomById(roomCode);
                const user = room.users[0];
                expect(user.id).toEqual(msg.userId);
                done();
            }
        });
    });

    it('should allow a user to rejoin after disconnecting', async done => {
        const username = 'John';

        controller = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        controller.on('message', (msg: any) => {
            if (msg.type === 'userInit') {
                const userId = msg.userId;
                const room = rs.getRoomById(roomCode);
                const user = room.getUserById(userId);

                expect(user.id).toEqual(msg.userId);
                expect(user.socketId).toEqual(controller.id);
                expect(user.active).toEqual(true);

                const controller2 = client(
                    `http://${url}/controller?roomId=${roomCode}&name=${username}&userId=${userId}`,
                    {
                        secure: true,
                        reconnection: true,
                        rejectUnauthorized: false,
                        reconnectionDelayMax: 5000,
                    }
                );
                controller2.on('message', (msg: any) => {
                    if (msg.type === 'userInit') {
                        expect(user.id).toEqual(msg.userId);
                        expect(user.socketId).toEqual(controller2.id);
                        expect(user.active).toEqual(true);

                        controller2.removeAllListeners();
                        done();
                    }
                });
            }
        });
    });

    it('should call the addUser method in room after a user joins without an id', async done => {
        const username = 'John';
        const room = rs.getRoomById(roomCode);
        const spy = jest.spyOn(room, 'addUser');

        controller = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        controller.on('message', (msg: any) => {
            const user = room.users[0];
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(user);
            done();
        });
    });

    it('should send and log GameAlreadyStartedError if new user joins a started game', async done => {
        const username = 'John';
        const room = rs.getRoomById(roomCode);
        const emitterSpy = jest.spyOn(emitter, 'sendErrorMessage');
        const consoleSpy = jest.spyOn(console, MessageTypes.ERROR);

        room.setPlaying();

        controller = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        controller.on('message', (msg: any) => {
            expect(msg.type).toEqual('error');
            expect(msg.name).toEqual(GameAlreadyStartedError.name);
            expect(emitterSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith(
                `${roomCode} | Controller Error 1 | ${GameAlreadyStartedError.name}`
            );
            done();
        });
    });

    it('should send and log GameAlreadyStartedError if new user joins a started game', async done => {
        const username = 'John';
        const room = rs.getRoomById(roomCode);
        const emitterSpy = jest.spyOn(emitter, 'sendErrorMessage');
        const consoleSpy = jest.spyOn(console, 'error');

        room.setPlaying();

        controller = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        controller.on('message', (msg: any) => {
            expect(emitterSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith(
                `${roomCode} | Controller Error 1 | ${GameAlreadyStartedError.name}`
            );
            done();
        });
    });

    it('should send a connectedUsers message to screens if controller joins', async done => {
        const username = 'John';
        const emitterSpy = jest.spyOn(emitter, 'sendConnectedUsers');

        controller = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });

        controller.on('message', (msg: any) => {
            expect(emitterSpy).toHaveBeenCalled();
            done();
        });
    });
    it('invokes an InvalidRoomCodeError on the screen if the room code is invalid', async done => {
        screen = client(`http://${url}/screen?roomId=test`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });

        screen.on('message', (msg: any) => {
            expect(msg.type).toEqual(MessageTypes.ERROR);
            expect(msg.name).toEqual(InvalidRoomCodeError.name);
            done();
        });
    });
    it('user is in connectedUsers message after joining', async done => {
        const username = 'John';

        controller = client(`http://${url}/controller?roomId=${roomCode}&name=${username}&userId=`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });

        controller.on('message', (msg: any) => {
            if (msg.type === MessageTypes.USER_INIT) {
                screen = client(`http://${url}/screen?roomId=${roomCode}`, {
                    secure: true,
                    reconnection: true,
                    rejectUnauthorized: false,
                    reconnectionDelayMax: 5000,
                });

                screen.on('message', (msg: any) => {
                    if (
                        msg.type !== MessageTypes.SCREEN_ADMIN &&
                        msg.type !== MessageTypes.SCREEN_STATE &&
                        msg.type !== MessageTypes.LEADERBOARD_STATE
                    ) {
                        expect(msg.type).toEqual(MessageTypes.CONNECTED_USERS);
                        expect(msg.users[0].socketId).toEqual(controller.id);
                        done();
                    }
                });
            }
        });
    });

    it('room should have 1 screen on screen connect and no screen on disconnect', async done => {
        const room = rs.getRoomById(roomCode);
        screen = client(`http://${url}/screen?roomId=${roomCode}`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });
        setTimeout(() => {
            expect(room.screens[0].id).toEqual(screen.id);
            screen.disconnect();
            setTimeout(() => {
                expect(room.screens.length).toEqual(0);
                done();
            }, 100);
        }, 100);
    });

    it('should call Screen init function on screen socket connect', async done => {
        const screenInit = jest.spyOn(Screen.prototype, "init");

        screen = client(`http://${url}/screen?roomId=${roomCode}`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });


        setTimeout(() => {
            expect(screenInit).toHaveBeenCalled();
            screenInit.mockClear();
            done();
        }, 100);
    });


    it('should call Screen onMessage function with message', async done => {
        const onMessage = jest.spyOn(Screen.prototype, "onMessage");

        screen = client(`http://${url}/screen?roomId=${roomCode}`, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 5000,
        });

        const message = {
            type: MessageTypes.SCREEN_STATE,
            state: "choose-game",
        }

        setTimeout(() => {
            screen.send(message);
            setTimeout(() => {
                expect(onMessage).toHaveBeenCalledWith(message);
                onMessage.mockClear();
                done();
            }, 200);
            done();
        }, 100);
    });
});