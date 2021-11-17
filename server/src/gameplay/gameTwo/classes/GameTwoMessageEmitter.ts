import { Namespace } from 'socket.io';
import { singleton } from 'tsyringe';

import GameEventEmitter from '../../../classes/GameEventEmitter';
import { EventMessageEmitter } from '../../../interfaces/EventMessageEmitter';
import Game from '../../Game';
import { GlobalEventMessage } from '../../interfaces/GlobalEventMessages';
import { IGameStateBase } from '../../interfaces/IGameStateBase';
import {
    GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    GAME_TWO_EVENT_MESSAGES,
    GameTwoEventMessage,
    GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED
} from '../interfaces/GameTwoEventMessages';
import { EventMessage } from '../../../interfaces/EventMessage';
import Room from '../../../classes/room';
import Player from '../../Player';

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
        controllerNameSpace: Namespace,
        screenNameSpace: Namespace,
        room: Room,
        message: GameTwoEventMessage
    ): void {

        switch (message.type) {
            case GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE:
                screenNameSpace.to(room.id).emit('message', message);
                break;
            case GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED:
                screenNameSpace.to(room.id).emit('message', message);
                controllerNameSpace.to(room.id).emit('message', message);
                break;
        }
    }
}
