import { Namespace, Server, Socket } from 'socket.io';
import Controller from '../classes/Controller';

import Screen from '../classes/Screen';
import { MessageTypes } from '../enums/messageTypes';
import { Namespaces } from '../enums/nameSpaces';
import CatchFoodGameEventEmitter from '../gameplay/catchFood/CatchFoodGameEventEmitter';
import { CatchFoodMsgType } from '../gameplay/catchFood/enums';
import { GameEvents } from '../gameplay/catchFood/interfaces';
import { GameEventTypes } from '../gameplay/enums';
import emitter from '../helpers/emitter';
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
        this.controllerNamespace.on('connection', (socket: Socket) => {
            const controller = new Controller(socket, this.rs, emitter, this.controllerNamespace, this.screenNameSpace);
            controller.init();
        });
    }
    private handleScreens() {
        this.screenNameSpace.on('connection', (socket: Socket) => {
            const screen = new Screen(socket, this.rs, emitter, this.screenNameSpace, this.controllerNamespace);
            screen.init();
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
        this.gameEventEmitter.on(GameEventTypes.PlayerIsDead, (data: GameEvents.PlayerIsDead) => {
            this.consoleInfo(data.roomId, GameEventTypes.GameHasResumed);
            const room = rs.getRoomById(data.roomId);
            const user = room.getUserById(data.userId);
            emitter.sendPlayerDied(controllerNamespace, user.socketId, data.rank);
        });
        this.gameEventEmitter.on(GameEventTypes.PlayerIsStunned, (data: GameEvents.PlayerStunnedState) => {
            // this.consoleInfo(data.roomId, GameEventTypes.GameHasResumed);
            const room = rs.getRoomById(data.roomId);
            const user = room.getUserById(data.userId);
            emitter.sendPlayerStunned(controllerNamespace, user.socketId);
        });
        this.gameEventEmitter.on(GameEventTypes.PlayerIsUnstunned, (data: GameEvents.PlayerStunnedState) => {
            // this.consoleInfo(data.roomId, GameEventTypes.GameHasResumed);
            const room = rs.getRoomById(data.roomId);
            const user = room.getUserById(data.userId);
            emitter.sendPlayerUnstunned(controllerNamespace, user.socketId);
        });
        this.gameEventEmitter.on(GameEventTypes.PlayerHasDisconnected, (data: GameEvents.PlayerHasDisconnectedInfo) => {
            this.consoleInfo(data.roomId, GameEventTypes.PlayerHasDisconnected);
            const room = rs.getRoomById(data.roomId);
            const user = room.getUserById(data.userId);
            emitter.sendPlayerHasDisconnected(screenNameSpace, user.id);
        });
        this.gameEventEmitter.on(GameEventTypes.PlayerHasReconnected, (data: GameEvents.PlayerHasReconnectedInfo) => {
            this.consoleInfo(data.roomId, GameEventTypes.PlayerHasReconnected);
            const room = rs.getRoomById(data.roomId);
            const user = room.getUserById(data.userId);
            emitter.sendPlayerHasReconnected(screenNameSpace, user.id);
        });
    }
    private consoleInfo(roomId: string, msg: string) {
        console.info(`${roomId} | ${msg}`);
    }
}

export default ConnectionHandler;
