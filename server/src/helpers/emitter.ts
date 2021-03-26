import { Namespace, Socket } from 'socket.io';

import Room from '../classes/room';
import User from '../classes/user';
import { MessageTypes } from '../enums/messageTypes';
import { CatchFoodMsgType } from '../gameplay/catchFood/interfaces/CatchFoodMsgType';
import { GameHasFinished, GameHasStarted, PlayerHasFinished } from '../gameplay/interfaces/index';

function sendUserInit(socket: any): void {
    socket.emit('message', {
        type: MessageTypes.USER_INIT,
        userId: socket.user.id,
        roomId: socket.room.id,
        name: socket.user.name,
        isAdmin: socket.room.isAdmin(socket.user),
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
function sendErrorMessage(socket: Socket, message: string): void {
    socket.emit('message', {
        type: 'error',
        msg: message,
    });
}
function sendGameHasStarted(nsps: Array<Namespace>, data: GameHasStarted): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(data.roomId).emit('message', {
            type: CatchFoodMsgType.HAS_STARTED,
            countdownTime: data.countdownTime,
        });
    });
}
function sendGameHasFinished(nsps: Array<Namespace>, data: GameHasFinished): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(data.roomId).emit('message', {
            type: MessageTypes.GAME_HAS_FINISHED,
            data: data,
        });
    });
}

function sendGameHasStopped(nsps: Array<Namespace>, roomId: string): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(roomId).emit('message', {
            type: MessageTypes.GAME_HAS_STOPPED,
        });
    });
}

function sendPlayerFinished(nsp: Namespace, user: User, data: PlayerHasFinished): void {
    nsp.to(user.socketId).emit('message', {
        type: CatchFoodMsgType.PLAYER_FINISHED,
        rank: data.rank,
    });
}

function sendConnectedUsers(nsp: Namespace, room: Room): void {
    nsp.to(room.id).emit('message', {
        type: MessageTypes.CONNECTED_USERS,
        users: room.users,
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
    sendConnectedUsers,
    sendMessage,
    sendGameHasStopped,
};
