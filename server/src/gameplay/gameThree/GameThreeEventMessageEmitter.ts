//TODO Events/Messages 3
import { Namespace } from 'socket.io';
import { singleton } from 'tsyringe';

import GameEventEmitter from '../../classes/GameEventEmitter';
import Room from '../../classes/room';
// import User from '../../classes/user';
import { EventMessage } from '../../interfaces/EventMessage';
import { EventMessageEmitter } from '../../interfaces/EventMessageEmitter';
import Game from '../Game';
import { GlobalEventMessage } from '../interfaces/GlobalEventMessages';
import { IGameStateBase } from '../interfaces/IGameStateBase';
import Player from '../Player';
import {
    GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC, GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER,
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
        controllerNameSpace: Namespace,
        screenNameSpace: Namespace,
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
            case GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE:
                this.sendToAll(message, screenNameSpace, room);
                break;
            // send to room's screens and controllers
            case GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC:
            case GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER:
                this.sendToAll(message, screenNameSpace, room);
                this.sendToAll(message, controllerNameSpace, room);
                break;
        }
    }
    private sendToAll(message: GameThreeEventMessage, nameSpace: Namespace, room: Room) {
        nameSpace.to(room.id).emit('message', message);
    }
}
