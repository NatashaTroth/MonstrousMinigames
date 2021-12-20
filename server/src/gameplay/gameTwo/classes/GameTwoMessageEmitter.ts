import { singleton } from 'tsyringe';

import { NamespaceAdapter } from '../interfaces';
import Game from '../../Game';
import Player from '../../Player';
import {
    GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    GAME_TWO_EVENT_MESSAGES,
    GameTwoEventMessage,
    GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED,
    GAME_TWO_EVENT_MESSAGE__GUESS_HINT,
    GAME_TWO_EVENT_MESSAGE__PLAYER_RANKS
} from '../interfaces/GameTwoEventMessages';
import { GlobalEventMessage } from '../../interfaces/GlobalEventMessages';
import { IGameStateBase } from '../../interfaces/IGameStateBase';
import GameEventEmitter from '../../../classes/GameEventEmitter';
import Room from '../../../classes/room';
import User from '../../../classes/user';
import { EventMessage } from '../../../interfaces/EventMessage';
import { EventMessageEmitter } from '../../../interfaces/EventMessageEmitter';

@singleton()
export class GameTwoMessageEmitter implements EventMessageEmitter {
    constructor(private readonly gameEventEmitter: GameEventEmitter) { }

    emit(message: GameTwoEventMessage | GlobalEventMessage): void {
        this.gameEventEmitter.emit(GameEventEmitter.EVENT_MESSAGE_EVENT, message);
    }
    canHandle(message: EventMessage, game: Game<Player, IGameStateBase>): boolean {
        return GAME_TWO_EVENT_MESSAGES.includes(message.type);
    }
    handle(
        controllerNameSpace: NamespaceAdapter,
        screenNameSpace: NamespaceAdapter,
        room: Room,
        message: GameTwoEventMessage
    ): void {
        let user: User;

        switch (message.type) {
            // send to screens
            case GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE:
            case GAME_TWO_EVENT_MESSAGE__PLAYER_RANKS:
                screenNameSpace.to(room.id).emit('message', message);
                break;
            // send to screens and controllers
            case GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED:
                screenNameSpace.to(room.id).emit('message', message);
                controllerNameSpace.to(room.id).emit('message', message);
                break;
            // send to single user's controller
            case GAME_TWO_EVENT_MESSAGE__GUESS_HINT:
                user = room.getUserById(message.userId);
                if (!user) {
                    break;
                }
                controllerNameSpace.to(user.socketId).emit('message', message);
                break;
        }
    }
}
