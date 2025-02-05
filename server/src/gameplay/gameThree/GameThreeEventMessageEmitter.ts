//TODO Events/Messages 3
import { singleton } from 'tsyringe';

import Game from '../Game';
import Player from '../Player';
import { GlobalEventMessage } from '../interfaces/GlobalEventMessages';
import { IGameStateBase } from '../interfaces/IGameStateBase';
import GameEventEmitter from '../../classes/GameEventEmitter';
import Room from '../../classes/room';
import { EventMessage } from '../../interfaces/EventMessage';
import { EventMessageEmitter } from '../../interfaces/EventMessageEmitter';

import { NamespaceAdapter } from './interfaces';

import {
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC, GAME_THREE_EVENT_MESSAGE__NEW_ROUND,
    GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS, GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS,
    GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN,
    GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER,
    GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS, GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS,
    GAME_THREE_EVENT_MESSAGES, GameThreeEventMessage
} from './interfaces/GameThreeEventMessages';

@singleton()
export class GameThreeEventMessageEmitter implements EventMessageEmitter {
    constructor(private readonly gameEventEmitter: GameEventEmitter) {}

    emit(message: GameThreeEventMessage | GlobalEventMessage): void {
        this.gameEventEmitter.emit(GameEventEmitter.EVENT_MESSAGE_EVENT, message);
    }
    canHandle(message: EventMessage, game: Game<Player, IGameStateBase>): boolean {
        return GAME_THREE_EVENT_MESSAGES.includes(message.type);
    }

    handle(
        controllerNameSpace: NamespaceAdapter,
        screenNameSpace: NamespaceAdapter,
        room: Room,
        message: GameThreeEventMessage
    ): void {
        // let user: User;

        switch (message.type) {
            // send to single user's controller
            // case GAME_THREE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE:
            //     user = room.getUserById(message.userId);
            //     if (!user) {
            //         break;
            //     }
            //     controllerNameSpace.to(user.socketId).emit('message', message);
            //     break;
            // send to room's screens
            // case GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE:
            //     this.sendToAll(message, screenNameSpace, room);
            //     break;
            // send to room's screens and controllers
            case GAME_THREE_EVENT_MESSAGE__NEW_ROUND:
            case GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC:
            case GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER:
            case GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS:
            case GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS:
            case GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN:
            case GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS:
            case GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS:
                // console.log('Sending to all');
                this.sendToAll(message, screenNameSpace, room);
                this.sendToAll(message, controllerNameSpace, room);
                break;
        }
    }
    private sendToAll(message: GameThreeEventMessage, nameSpace: NamespaceAdapter, room: Room) {
        nameSpace.to(room.id).emit('message', message);
    }
    removeAllListeners(): void {
        this.gameEventEmitter.removeAllListeners();
    }
}
