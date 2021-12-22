import { Namespace } from 'socket.io';

import { singleton } from 'tsyringe';

import Game from '../Game';
import Player from '../Player';
import { GlobalEventMessage } from '../interfaces/GlobalEventMessages';
import { IGameStateBase } from '../interfaces/IGameStateBase';
import GameEventEmitter from '../../classes/GameEventEmitter';
import Room from '../../classes/room';
import { EventMessage } from '../../interfaces/EventMessage';
import { EventMessageEmitter } from '../../interfaces/EventMessageEmitter';

import {
    GAME_NUMBER_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE, GAME_NUMBER_EVENT_MESSAGES,
    GameNumberEventMessage
} from './interfaces/GameNumberEventMessages';

//TODO !!!!: REGISTER IN app.ts (DEPENDENCY INJECTION)
@singleton()
export class GameNumberEventMessageEmitter implements EventMessageEmitter {
    constructor(private readonly gameEventEmitter: GameEventEmitter) { }

    emit(message: GameNumberEventMessage | GlobalEventMessage): void {
        this.gameEventEmitter.emit(GameEventEmitter.EVENT_MESSAGE_EVENT, message);
    }
    canHandle(message: EventMessage, game: Game<Player, IGameStateBase>): boolean {
        return GAME_NUMBER_EVENT_MESSAGES.includes(message.type);
    }
    handle(
        controllerNameSpace: Namespace,
        screenNameSpace: Namespace,
        room: Room,
        message: GameNumberEventMessage
    ): void {
        // let user: User;

        switch (message.type) {
            // send to single user's controller
            // case GAME_NUMBER_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE:
            //     user = room.getUserById(message.userId);
            //     if (!user) {
            //         break;
            //     }
            //     controllerNameSpace.to(user.socketId).emit('message', message);
            //     break;
            // send to room's screens
            case GAME_NUMBER_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE:
                screenNameSpace.to(room.id).emit('message', message);
                break;
        }

    }
    removeAllListeners(): void {
        this.gameEventEmitter.removeAllListeners();
    }
}
