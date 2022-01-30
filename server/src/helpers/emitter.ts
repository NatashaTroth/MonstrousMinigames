import { Namespace, Socket } from 'socket.io';

import Room from '../classes/room';
import User from '../classes/user';
import { GameNames } from '../enums/gameNames';
import { MessageTypes } from '../enums/messageTypes';
import { GameOneMsgType } from '../gameplay/gameOne/enums';
import { GameTwoMessageTypes } from '../gameplay/gameTwo/enums/GameTwoMessageTypes';
import { LeaderboardInfo } from '../gameplay/leaderboard/interfaces';

function sendUserInit(socket: Socket, user: User, room: Room, state: string | undefined): void {
    socket.emit('message', {
        type: MessageTypes.USER_INIT,
        userId: user.id,
        roomId: room.id,
        name: user.name,
        number: user.number,
        characterNumber: user.characterNumber,
        ready: user.ready,
        screenState: state,
    });
}

function sendGameSet(nsps: Namespace[], room: Room, game: string): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(room.id).emit('message', {
            type: MessageTypes.GAME_SET,
            game: game,
        });
    });
}

function sendGameState(nsp: Namespace, room: Room, volatile = false): void {
    if (volatile) {
        nsp.to(room.id).volatile.emit('message', {
            type: room.game.gameStateMessage,
            data: room.game?.getGameStateInfo(),
        });
    } else {
        nsp.to(room.id).emit('message', {
            type: room.game.gameStateMessage,
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

function sendAllScreensPhaserGameLoaded(nsps: Array<Namespace>, room: Room, game: string): void {
    let type = '';
    switch (game) {
        case GameNames.GAME1:
            type = GameOneMsgType.ALL_SCREENS_PHASER_GAME_LOADED;
            break;
        case GameNames.GAME2:
            type = GameTwoMessageTypes.ALL_SCREENS_PHASER_GAME_LOADED;
            break;
    }
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(room.id).emit('message', {
            type,
        });
    });
}

function sendScreenPhaserGameLoadedTimedOut(nsp: Namespace, socketId: string, game: string): void {
    let type = '';
    switch (game) {
        case GameNames.GAME1:
            type = GameOneMsgType.PHASER_LOADING_TIMED_OUT;
            break;
        case GameNames.GAME2:
            type = GameTwoMessageTypes.PHASER_LOADING_TIMED_OUT;
            break;
    }

    nsp.to(socketId).emit('message', {
        type,
    });
}

function sendStartPhaserGame(nsps: Array<Namespace>, room: Room, game: string): void {
    let type = '';
    switch (game) {
        case GameNames.GAME1:
            type = GameOneMsgType.START_PHASER_GAME;
            break;
        case GameNames.GAME2:
            type = GameTwoMessageTypes.START_PHASER_GAME;
            break;
    }
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(room.id).emit('message', {
            type,
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

function sendScreenAdmin(nsp: Namespace, socketId: string, isScreenAdmin: boolean): void {
    nsp.to(socketId).emit('message', {
        type: MessageTypes.SCREEN_ADMIN,
        isAdmin: isScreenAdmin,
    });
}

function sendScreenState(nsp: Namespace | Socket, state: string | undefined, game?: string | undefined): void {
    nsp.emit('message', {
        type: MessageTypes.SCREEN_STATE,
        state: state,
        game: game,
    });
}

function sendMessage(type: MessageTypes | GameOneMsgType, nsps: Array<Namespace>, recipient: string): void {
    nsps.forEach(function (namespace: Namespace) {
        namespace.to(recipient).emit('message', {
            type: type,
        });
    });
}

function sendLeaderboardState(nsp: Namespace | Socket, leaderboardState: LeaderboardInfo): void {
    nsp.emit('message', {
        type: MessageTypes.LEADERBOARD_STATE,
        leaderboardState,
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
    sendGameSet,
    sendLeaderboardState,
};
