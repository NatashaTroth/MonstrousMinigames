import { Namespace, Socket } from 'socket.io';

import Room from '../classes/room';
import User from '../classes/user';
import { MessageTypes } from '../enums/messageTypes';
import { CatchFoodMsgType } from '../gameplay/catchFood/enums';
import { GameEvents } from '../gameplay/catchFood/interfaces';

function sendUserInit(socket: any, number: number): void {
    socket.emit('message', {
        type: MessageTypes.USER_INIT,
        userId: socket.user.id,
        roomId: socket.room.id,
        name: socket.user.name,
        isAdmin: socket.room.isAdmin(socket.user),
        number: number,
        characterNumber: socket.user.characterNumber,
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
function sendGameHasStarted(nsps: Array<Namespace>, data: GameEvents.GameHasStarted): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(data.roomId).emit('message', {
            type: CatchFoodMsgType.HAS_STARTED,
            countdownTime: data.countdownTime,
        });
    });
}
function sendGameHasFinished(nsps: Array<Namespace>, data: GameEvents.GameHasFinished): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(data.roomId).emit('message', {
            type: MessageTypes.GAME_HAS_FINISHED,
            data: data,
        });
    });
}

function sendGameHasTimedOut(nsps: Array<Namespace>, data: GameEvents.GameHasFinished): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(data.roomId).emit('message', {
            type: MessageTypes.GAME_HAS_TIMED_OUT,
            data: data,
        });
    });
}

function sendPlayerFinished(nsp: Namespace, user: User, data: GameEvents.PlayerHasFinished): void {
    nsp.to(user.socketId).emit('message', {
        type: CatchFoodMsgType.PLAYER_FINISHED,
        rank: data.rank,
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

function sendMessage(type: MessageTypes, nsps: Array<Namespace>, roomId: string): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(roomId).emit('message', {
            type: type,
        });
    });
}

export default {
    sendUserInit,
    sendGameState,
    sendErrorMessage,
    sendGameHasStarted,
    sendPlayerFinished,
    sendGameHasFinished,
    sendGameHasTimedOut,
    sendConnectedUsers,
    sendMessage,
    sendScreenAdmin,
};
