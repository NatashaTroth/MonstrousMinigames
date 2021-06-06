import { Namespace, Server } from 'socket.io';

import Room from '../classes/room';
import User from '../classes/user';
import { Globals } from '../enums/globals';
import { MessageTypes } from '../enums/messageTypes';
import { Namespaces } from '../enums/nameSpaces';
import CatchFoodGameEventEmitter from '../gameplay/catchFood/CatchFoodGameEventEmitter';
import { CatchFoodMsgType } from '../gameplay/catchFood/enums';
import { GameEvents } from '../gameplay/catchFood/interfaces';
import { GameEventTypes } from '../gameplay/enums';
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

    public shutdown(): void {
        this.controllerNamespace.removeAllListeners();
        this.screenNameSpace.removeAllListeners();
        this.io.removeAllListeners();
        this.gameEventEmitter.removeAllListeners();
    }
    private handleControllers() {
        const rs = this.rs;
        const controllerNamespace = this.controllerNamespace;
        const screenNameSpace = this.screenNameSpace;

        this.controllerNamespace.on('connection', function (socket) {
            const name = socket.handshake.query.name;
            const roomId = socket.handshake.query.roomId;

            let room: Room;

            try {
                room = rs.getRoomById(roomId);
            } catch (e) {
                emitter.sendErrorMessage(socket, e);
                console.error(roomId + ' | ' + e.name);
                return;
            }

            socket.room = room;

            socket.join(socket.room.id);

            /* User join logic */
            let user: User;
            let userId = socket.handshake.query.userId;
            user = socket.room.getUserById(userId);
            if (user) {
                // user is in room
                user.setRoomId(roomId);
                user.setSocketId(socket.id);
                user.setActive(true);
            } else {
                // assign user id
                user = new User(socket.room.id, socket.id, name);
                userId = user.id;

                try {
                    socket.room.addUser(user);
                } catch (e) {
                    emitter.sendErrorMessage(socket, e);
                    console.error(roomId + ' | ' + e.name);
                    return;
                }
            }
            socket.user = user;

            emitter.sendConnectedUsers([controllerNamespace, screenNameSpace], socket.room);
            console.info(socket.room.id + ' | Controller connected: ' + socket.user.id);

            emitter.sendUserInit(socket, user.number);

            socket.on('disconnect', () => {
                console.info(socket.room.id + ' | Controller disconnected: ' + socket.user.id);
                try {
                    socket.room.userDisconnected(socket.user.id);
                } catch (e) {
                    emitter.sendErrorMessage(socket, e);
                    console.error(roomId + ' | ' + e.name + ' | ' + userId);
                    return;
                }
                if (socket.room.isOpen()) {
                    emitter.sendConnectedUsers([controllerNamespace, screenNameSpace], socket.room);
                    const admin = socket.room.admin;
                    if (admin) {
                        controllerNamespace.to(admin.socketId).emit('message', {
                            type: MessageTypes.USER_INIT,
                            userId: admin.id,
                            roomId: socket.room.id,
                            name: admin.name,
                            isAdmin: socket.room.isAdmin(admin),
                            number: admin.number,
                        });
                    }
                }
            });

            socket.on('message', function (message: IMessage) {
                const type = message.type;
                switch (type) {
                    case CatchFoodMsgType.START: {
                        if (socket.room.isOpen() && socket.room.isAdmin(socket.user)) {
                            try {
                                room.startGame();
                            } catch (e) {
                                console.error(socket.room.id + ' | ' + e.name);
                                emitter.sendErrorMessage(socket, e);
                            }

                            emitter.sendGameState(screenNameSpace, socket.room);

                            const gameStateInterval = setInterval(() => {
                                if (!socket.room.isPlaying() && !socket.room.isPaused()) {
                                    clearInterval(gameStateInterval);
                                }
                                // send gamestate volatile
                                if (socket.room.isPlaying()) {
                                    emitter.sendGameState(screenNameSpace, socket.room, true);
                                }
                            }, Globals.GAME_STATE_UPDATE_MS);
                        }

                        break;
                    }
                    case CatchFoodMsgType.MOVE: {
                        if (socket.room.isPlaying()) {
                            try {
                                socket.room.game?.runForward(socket.user.id, parseInt(`${process.env.SPEED}`, 10) || 2);
                            } catch (e) {
                                emitter.sendErrorMessage(socket, e);
                                console.error(roomId + ' | ' + e.name);
                            }
                        }
                        break;
                    }
                    case CatchFoodMsgType.OBSTACLE_SOLVED: {
                        const obstacleMessage = message as IMessageObstacle;
                        const obstacleId = obstacleMessage.obstacleId;
                        try {
                            socket.room.game?.playerHasCompletedObstacle(socket.user.id, obstacleId);
                        } catch (e) {
                            emitter.sendErrorMessage(socket, e);
                            console.error(roomId + ' | ' + e.name);
                        }
                        break;
                    }
                    case MessageTypes.SELECT_CHARACTER: {
                        console.log('asidniasdni');
                        if (message.characterNumber) {
                            try {
                                socket.room.setUserCharacter(socket.user, parseInt(message.characterNumber));
                                emitter.sendConnectedUsers([controllerNamespace, screenNameSpace], socket.room);
                            } catch (e) {
                                emitter.sendErrorMessage(socket, e);
                                console.error(roomId + ' | ' + e.name);
                            }
                        }
                        break;
                    }
                    case MessageTypes.BACK_TO_LOBBY:
                        {
                            if (!socket.room.isOpen() && socket.room.isAdmin(socket.user)) {
                                console.info(socket.room.id + ' | Reset Game');
                                socket.room.resetGame().then(() => {
                                    emitter.sendMessage(
                                        MessageTypes.GAME_HAS_RESET,
                                        [controllerNamespace, screenNameSpace],
                                        socket.room.id
                                    );
                                    emitter.sendConnectedUsers([controllerNamespace, screenNameSpace], socket.room);
                                    emitter.sendUserInit(socket, user.number);
                                });
                            }
                        }
                        break;
                    default: {
                        console.info(message);
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

            let room: Room;

            try {
                room = rs.getRoomById(roomId);
            } catch (e) {
                emitter.sendErrorMessage(socket, e);
                console.error(roomId + ' | ' + e.name);

                return;
            }
            socket.room = room;
            socket.room.addScreen(socket.id);
            socket.join(socket.room.id);
            console.info(socket.room.id + ' | Screen connected');

            emitter.sendConnectedUsers([screenNameSpace], socket.room);

            if (socket.room.isAdminScreen(socket.id)) {
                emitter.sendScreenAdmin(screenNameSpace, socket.id);
            }

            socket.on('disconnect', () => {
                console.info(socket.room.id + ' | Screen disconnected');
                socket.room.removeScreen(socket.id);

                if (socket.room.getAdminScreenId()) {
                    emitter.sendScreenAdmin(screenNameSpace, socket.room.getAdminScreenId());
                }
            });

            socket.on('message', function (message: IMessage) {
                const type = message.type;
                switch (type) {
                    case CatchFoodMsgType.START: {
                        if (socket.room.isOpen() && socket.room.isAdminScreen(socket.id)) {
                            try {
                                room.startGame();
                            } catch (e) {
                                console.error(socket.room.id + ' | ' + e.name);
                                emitter.sendErrorMessage(socket, e);
                            }

                            emitter.sendGameState(screenNameSpace, socket.room);

                            const gameStateInterval = setInterval(() => {
                                if (!socket.room.isPlaying() && !socket.room.isPaused()) {
                                    clearInterval(gameStateInterval);
                                }
                                // send gamestate volatile
                                if (socket.room.isPlaying()) {
                                    emitter.sendGameState(screenNameSpace, socket.room, true);
                                }
                            }, Globals.GAME_STATE_UPDATE_MS);
                        }

                        break;
                    }
                    case MessageTypes.PAUSE_RESUME: {
                        if (socket.room.isPlaying()) {
                            console.info(socket.room.id + ' | Pause Game');
                            try {
                                socket.room.pauseGame();
                            } catch (e) {
                                console.error(socket.room.id + ' | ' + e.name);
                                emitter.sendErrorMessage(socket, e);
                            }
                        } else if (socket.room.isPaused()) {
                            console.info(socket.room.id + ' | Resume Game');
                            try {
                                socket.room.resumeGame();
                            } catch (e) {
                                console.error(socket.room.id + ' | ' + e.name);
                                emitter.sendErrorMessage(socket, e);
                            }
                        }

                        break;
                    }
                    case MessageTypes.STOP_GAME: {
                        if (socket.room.isPlaying() || socket.room.isPaused()) {
                            console.info(socket.room.id + ' | Stop Game');
                            try {
                                socket.room.stopGame();
                            } catch (e) {
                                console.error(socket.room.id + ' | ' + e.name);
                                emitter.sendErrorMessage(socket, e);
                            }
                        }
                        break;
                    }
                    default: {
                        console.info(message);
                    }
                }
            });
        });
    }
    private handleGameEvents() {
        const rs = this.rs;
        const controllerNamespace = this.controllerNamespace;
        const screenNameSpace = this.screenNameSpace;
        this.gameEventEmitter.on(GameEventTypes.ObstacleReached, (data: GameEvents.ObstacleReachedInfo) => {
            console.info(data.roomId + ' | userId: ' + data.userId + ' | Obstacle: ' + data.obstacleType);
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
        this.gameEventEmitter.on(GameEventTypes.PlayerHasFinished, (data: GameEvents.PlayerHasFinished) => {
            console.info(data.roomId + ' | userId: ' + data.userId + ' | Rank: ' + data.rank);
            const room = rs.getRoomById(data.roomId);
            const user = room.getUserById(data.userId);
            if (user) {
                emitter.sendPlayerFinished(controllerNamespace, user, data);
            }
        });
        this.gameEventEmitter.on(GameEventTypes.GameHasStarted, (data: GameEvents.GameHasStarted) => {
            this.consoleInfo(data.roomId, GameEventTypes.GameHasStarted);
            emitter.sendGameHasStarted([controllerNamespace, screenNameSpace], data);
        });
        this.gameEventEmitter.on(GameEventTypes.GameHasFinished, (data: GameEvents.GameHasFinished) => {
            this.consoleInfo(data.roomId, GameEventTypes.GameHasFinished);
            const room = rs.getRoomById(data.roomId);
            room.setFinished();
            emitter.sendGameHasFinished([controllerNamespace, screenNameSpace], data);
        });
        this.gameEventEmitter.on(GameEventTypes.GameHasTimedOut, (data: GameEvents.GameHasFinished) => {
            this.consoleInfo(data.roomId, GameEventTypes.GameHasTimedOut);
            const room = rs.getRoomById(data.roomId);
            room.setFinished();
            emitter.sendGameHasTimedOut([controllerNamespace, screenNameSpace], data);
        });
        this.gameEventEmitter.on(GameEventTypes.GameHasStopped, (data: GameEvents.GameStateHasChanged) => {
            this.consoleInfo(data.roomId, GameEventTypes.GameHasStopped);
            const room = rs.getRoomById(data.roomId);
            room.setOpen();
            emitter.sendMessage(MessageTypes.GAME_HAS_STOPPED, [controllerNamespace, screenNameSpace], data.roomId);
        });
        this.gameEventEmitter.on(GameEventTypes.GameHasPaused, (data: GameEvents.GameStateHasChanged) => {
            this.consoleInfo(data.roomId, GameEventTypes.GameHasPaused);
            const room = rs.getRoomById(data.roomId);
            room.setPaused();
            emitter.sendMessage(MessageTypes.GAME_HAS_PAUSED, [controllerNamespace, screenNameSpace], data.roomId);
        });
        this.gameEventEmitter.on(GameEventTypes.GameHasResumed, (data: GameEvents.GameStateHasChanged) => {
            this.consoleInfo(data.roomId, GameEventTypes.GameHasResumed);
            const room = rs.getRoomById(data.roomId);
            room.setPlaying();
            emitter.sendMessage(MessageTypes.GAME_HAS_RESUMED, [controllerNamespace, screenNameSpace], data.roomId);
        });
    }
    private consoleInfo(roomId: string, msg: string) {
        console.info(`${roomId} | ${msg}`);
    }
}

export default ConnectionHandler;
