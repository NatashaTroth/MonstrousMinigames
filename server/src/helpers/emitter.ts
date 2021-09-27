import { Namespace, Socket } from 'socket.io';

import Room from '../classes/room';
import User from '../classes/user';
import { MessageTypes } from '../enums/messageTypes';
import { CatchFoodMsgType } from '../gameplay/catchFood/enums';

function sendUserInit(socket: Socket, user: User, room: Room): void {
    socket.emit('message', {
        type: MessageTypes.USER_INIT,
        userId: user.id,
        roomId: room.id,
        name: user.name,
        number: user.number,
        characterNumber: user.characterNumber,
        ready: user.ready,
    });
}

function sendGameState(nsp: Namespace, room: Room, volatile = false): void {
    if (volatile) {
        nsp.to(room.id).volatile.emit('message', {
            type: CatchFoodMsgType.GAME_STATE,
            data: room.game?.getGameStateInfo(),
        });
    } else {
        nsp.to(room.id).emit('message', {
            type: CatchFoodMsgType.GAME_STATE,
            data: room.game?.getGameStateInfo(),
        });
    }
}

function sendErrorMessage(socket: Socket, e: Error): void {
    socket.emit('message', {
        type: MessageTypes.ERROR,
        name: e.name,
        msg: e.message,
    });
}

function sendAllScreensPhaserGameLoaded(nsps: Array<Namespace>, room: Room): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(room.id).emit('message', {
            type: CatchFoodMsgType.ALL_SCREENS_PHASER_GAME_LOADED,
        });
    });
}

function sendScreenPhaserGameLoadedTimedOut(nsp: Namespace, socketId: string): void {
    //TODO
    nsp.to(socketId).emit('message', {
        type: CatchFoodMsgType.PHASER_LOADING_TIMED_OUT,
    });
}

function sendStartPhaserGame(nsps: Array<Namespace>, room: Room): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(room.id).emit('message', {
            type: CatchFoodMsgType.START_PHASER_GAME,
        });
    });
}

function sendConnectedUsers(nsps: Array<Namespace>, room: Room): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(room.id).emit('message', {
            type: MessageTypes.CONNECTED_USERS,
            users: room.users,
        });
    });
}

function sendScreenAdmin(nsp: Namespace, socketId: string): void {
    nsp.to(socketId).emit('message', {
        type: MessageTypes.SCREEN_ADMIN,
    });
}

function sendScreenState(nsp: Namespace | Socket, state: string | undefined): void {
    nsp.emit('message', {
        type: MessageTypes.SCREEN_STATE,
        state: state,
    });
}

function sendMessage(type: MessageTypes | CatchFoodMsgType, nsps: Array<Namespace>, recipient: string): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(recipient).emit('message', {
            type: type,
        });
    });
}

export default {
    sendUserInit,
    sendGameState,
    sendErrorMessage,
    sendAllScreensPhaserGameLoaded,
    sendScreenPhaserGameLoadedTimedOut,
    sendStartPhaserGame,
    sendConnectedUsers,
    sendMessage,
    sendScreenAdmin,
    sendScreenState,
};
