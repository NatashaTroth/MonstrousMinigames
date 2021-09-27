import { Namespace } from 'socket.io';
import { singleton } from 'tsyringe';

import GameEventEmitter from '../../classes/GameEventEmitter';
import Room from '../../classes/room';
import User from '../../classes/user';
import { EventMessage } from '../../interfaces/EventMessage';
import { EventMessageEmitter } from '../../interfaces/EventMessageEmitter';
import Game from '../Game';
import { GlobalEventMessage } from '../interfaces/GlobalEventMessages';
import { IGameStateBase } from '../interfaces/IGameStateBase';
import Player from '../Player';
import {
    CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE,
    CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD, CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED, CATCH_FOOD_GAME_EVENT_MESSAGES,
    CatchFoodGameEventMessage
} from './interfaces/CatchFoodGameEventMessages';

@singleton()
export class CatchFoodGameEventMessageEmitter implements EventMessageEmitter {
    constructor(private readonly gameEventEmitter: GameEventEmitter) {}

    emit(message: CatchFoodGameEventMessage | GlobalEventMessage): void {
        this.gameEventEmitter.emit(GameEventEmitter.EVENT_MESSAGE_EVENT, message);
    }
    canHandle(message: EventMessage, game: Game<Player, IGameStateBase>): boolean {
        return CATCH_FOOD_GAME_EVENT_MESSAGES.includes(message.type);
    }
    handle(
        controllerNameSpace: Namespace,
        screenNameSpace: Namespace,
        room: Room,
        message: CatchFoodGameEventMessage
    ): void {
        let user: User;

        console.log(room.id + ' | ', message);
        switch (message.type) {
            // send to single user's controller
            case CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED:
                user = room.getUserById(message.userId);
                if (!user) {
                    break;
                }
                controllerNameSpace.to(user.socketId).emit('message', message);
                break;
            // send to room's screens
            case CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED:
                screenNameSpace.to(room.id).emit('message', message);
                break;
        }
    }
}
