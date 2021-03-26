import { Namespace, Server } from 'socket.io';

import User from '../classes/user';
import { MessageTypes } from '../enums/messageTypes';
import { Namespaces } from '../enums/nameSpaces';
import CatchFoodGameEventEmitter from '../gameplay/catchFood/CatchFoodGameEventEmitter';
import { PlayerFinishedInfo } from '../gameplay/catchFood/interfaces';
import { CatchFoodMsgType } from '../gameplay/catchFood/interfaces/CatchFoodMsgType';
import {
    GameEventTypes, GameHasFinished, GameHasStarted, GameStateHasChanged, ObstacleReachedInfo
} from '../gameplay/interfaces/index';
import emitter from '../helpers/emitter';
import { IMessageObstacle } from '../interfaces/messageObstacle';
import { IMessage } from '../interfaces/messages';
import RoomService from './roomService';

class ConnectionHandler {
    private io: Server;
    private gameEventEmitter: CatchFoodGameEventEmitter;
    private rs: RoomService;
    private controllerNamespace: Namespace;
    private screenNameSpace: Namespace;

    constructor(io: Server, rs: RoomService) {
        this.io = io;
        this.gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
        this.rs = rs;
        this.controllerNamespace = this.io.of(Namespaces.CONTROLLER);
        this.screenNameSpace = this.io.of(Namespaces.SCREEN);
    }

    public handle(): void {
        this.handleControllers();
        this.handleScreens();
        this.handleGameEvents();
    }
    private handleControllers() {
        const rs = this.rs;
        const controllerNamespace = this.controllerNamespace;
        const screenNameSpace = this.screenNameSpace;

        this.controllerNamespace.on('connection', function (socket) {
            const name = socket.handshake.query.name;
            const roomId = socket.handshake.query.roomId;

            const room = rs.getRoomById(roomId);

            if (!room) {
                emitter.sendErrorMessage(socket, 'Room code does not exist!');
                console.log('User tried to join non-existing room' + roomId);
                return;
            }

            socket.room = room;

            socket.join(socket.room.id);

            /* User join logic */
            let user: User;
            let userId = socket.handshake.query.userId;
            if (userId) {
                // check if user is in room
                user = socket.room.getUserById(userId);
                if (user) {
                    // user is in room
                    user.setRoomId(roomId);
                    user.setSocketId(socket.id);
                    user.setActive(true);
                } else {
                    user = new User(socket.room.id, socket.id, name);
                    userId = user.id;
                    if (!socket.room.addUser(user)) {
                        emitter.sendErrorMessage(socket, 'Cannot join. Game already started');
                        console.log('User tried to join. Game already started: ' + userId);
                        return;
                    }
                }
            } else {
                // assign user id
                user = new User(socket.room.id, socket.id, name);
                userId = user.id;

                if (!socket.room.addUser(user)) {
                    emitter.sendErrorMessage(socket, 'Cannot join. Game already started');
                    console.log('User tried to join. Game already started: ' + userId);
                    return;
                }
            }
            socket.user = user;

            emitter.sendConnectedUsers(screenNameSpace, socket.room);
            console.log(socket.room.id + ' | Controller connected: ' + socket.user.id);

            emitter.sendUserInit(socket);

            socket.on('disconnect', () => {
                console.log(socket.room.id + ' | Controller disconnected: ' + socket.user.id);
                socket.room.userDisconnected(socket.user.id);

                if (socket.room.isOpen()) {
                    emitter.sendConnectedUsers(screenNameSpace, socket.room);
                    const admin = socket.room.admin;
                    if (admin) {
                        controllerNamespace.to(admin.socketId).emit('message', {
                            type: MessageTypes.USER_INIT,
                            userId: admin.id,
                            roomId: socket.room.id,
                            name: admin.name,
                            isAdmin: socket.room.isAdmin(admin),
                        });
                    }
                }
            });

            socket.on('message', function (message: IMessage) {
                const type = message.type;
                switch (type) {
                    case CatchFoodMsgType.START: {
                        if (socket.room.isOpen() && socket.room.isAdmin(socket.user)) {
                            rs.startGame(socket.room);

                            emitter.sendGameState(screenNameSpace, socket.room);

                            const gameStateInterval = setInterval(() => {
                                if (!socket.room.isPlaying()) {
                                    clearInterval(gameStateInterval);
                                }
                                // send gamestate volatile
                                if (socket.room.isPlaying()) {
                                emitter.sendGameState(screenNameSpace, socket.room, true);
                                }
                            }, 100);
                        }

                        break;
                    }
                    case CatchFoodMsgType.MOVE: {
                        if (socket.room.isPlaying()) {
                            socket.room.game?.runForward(socket.user.id, parseInt(`${process.env.SPEED}`, 10) || 1);
                        }
                        break;
                    }
                    case CatchFoodMsgType.OBSTACLE_SOLVED: {
                        const obstacleMessage = message as IMessageObstacle;
                        const obstacleId = obstacleMessage.obstacleId;
                        socket.room.game?.playerHasCompletedObstacle(socket.user.id, obstacleId);
                        break;
                    }
                    case MessageTypes.BACK_TO_LOBBY:
                        {
                            if (!socket.room.isOpen() && socket.room.isAdmin(socket.user)) {
                                console.log(socket.room.id + ' | Reset Game');
                                socket.room.resetGame().then(() => {
                                    emitter.sendMessage(
                                        MessageTypes.GAME_HAS_RESET,
                                        [controllerNamespace, screenNameSpace],
                                        socket.room.id
                                    );
                                    emitter.sendConnectedUsers(screenNameSpace, socket.room);
                                    emitter.sendUserInit(socket);
                                });
                            }
                        }
                        break;
                    case MessageTypes.STOP_GAME: {
                        if (socket.room.isPlaying() || socket.room.isPaused()) {
                            console.log(socket.room.id + ' | Stop Game');
                            socket.room.stopGame();
                        }
                        break;
                    }
                    case MessageTypes.PAUSE_RESUME: {
                        if (socket.room.isAdmin(socket.user)) {
                            if (socket.room.isPlaying()) {
                                console.log(socket.room.id + ' | Pause Game');
                                socket.room.pauseGame()
                            }else if (socket.room.isPaused()) {
                                console.log(socket.room.id + ' | Resume Game');
                                socket.room.resumeGame()
                         }
                        }

                        break;
                    }
                    default: {
                        console.log(message);
                    }
                }
            });
        });
    }
    private handleScreens() {
        const rs = this.rs;
        const screenNameSpace = this.screenNameSpace;

        this.screenNameSpace.on('connection', function (socket) {
            const roomId = socket.handshake.query.roomId;

            const room = rs.getRoomById(roomId);

            if (!room) {
                emitter.sendErrorMessage(socket, 'Room code does not exist!');
                console.log('User tried to join non-existing room' + roomId);
                return;
            }
            socket.room = room;
            socket.join(socket.room.id);

            console.log(socket.room.id + ' | Screen connected');

            emitter.sendConnectedUsers(screenNameSpace, socket.room);

            socket.on('disconnect', () => {
                console.log(socket.room.id + ' | Screen disconnected');
            });

            socket.on('message', function (message: IMessage) {
                console.log(message);

                socket.broadcast.emit('message', message);
            });
        });
    }
    private handleGameEvents() {
        const rs = this.rs;
        const controllerNamespace = this.controllerNamespace;
        const screenNameSpace = this.screenNameSpace;
        this.gameEventEmitter.on(GameEventTypes.ObstacleReached, (data: ObstacleReachedInfo) => {
            console.log(data.roomId + ' | userId: ' + data.userId + ' | Obstacle: ' + data.obstacleType);
            const r = rs.getRoomById(data.roomId);
            const u = r.getUserById(data.userId);
            if (u) {
                this.controllerNamespace.to(u.socketId).emit('message', {
                    type: CatchFoodMsgType.OBSTACLE,
                    obstacleType: data.obstacleType,
                    obstacleId: data.obstacleId,
                });
            }
        });
        this.gameEventEmitter.on(GameEventTypes.PlayerHasFinished, (data: PlayerFinishedInfo) => {
            console.log(data.roomId + ' | userId: ' + data.userId + ' | Rank: ' + data.rank);
            const room = rs.getRoomById(data.roomId);
            const user = room.getUserById(data.userId);
            if (user) {
                emitter.sendPlayerFinished(controllerNamespace, user, data);
            }
        });
        this.gameEventEmitter.on(GameEventTypes.GameHasStarted, (data: GameHasStarted) => {
            console.log(data.roomId + ' | Game has started!');
            emitter.sendGameHasStarted([controllerNamespace, screenNameSpace], data);
        });
        this.gameEventEmitter.on(GameEventTypes.GameHasFinished, (data: GameHasFinished) => {
            console.log(data.roomId + ' | Game has finished');
            const room = rs.getRoomById(data.roomId);
            room.setClosed();
            emitter.sendGameHasFinished([controllerNamespace, screenNameSpace], data);
        });
        this.gameEventEmitter.on(GameEventTypes.GameHasTimedOut, (data: GameHasFinished) => {
            console.log(data.roomId + ' | Game has timed out');
            const room = rs.getRoomById(data.roomId);
            room.setClosed();
            emitter.sendGameHasFinished([controllerNamespace, screenNameSpace], data);
        });
        this.gameEventEmitter.on(GameEventTypes.GameHasStopped, (data: GameStateHasChanged) => {
            console.log(data.roomId + ' | Game has stopped');
            const room = rs.getRoomById(data.roomId);
            room.setClosed();
            emitter.sendMessage(MessageTypes.GAME_HAS_STOPPED, [controllerNamespace, screenNameSpace], data.roomId);
        });
        this.gameEventEmitter.on(GameEventTypes.GameHasPaused, (data: GameStateHasChanged) => {
            console.log(data.roomId + ' | Game has stopped');
            const room = rs.getRoomById(data.roomId);
            room.setPaused();
            emitter.sendMessage(MessageTypes.GAME_HAS_PAUSED, [controllerNamespace, screenNameSpace], data.roomId);
        });
        this.gameEventEmitter.on(GameEventTypes.GameHasResumed, (data: GameStateHasChanged) => {
            console.log(data.roomId + ' | Game has stopped');
            const room = rs.getRoomById(data.roomId);
            room.setPlaying();
            emitter.sendMessage(MessageTypes.GAME_HAS_RESUMED, [controllerNamespace, screenNameSpace], data.roomId);
        });
    }
}

export default ConnectionHandler;
