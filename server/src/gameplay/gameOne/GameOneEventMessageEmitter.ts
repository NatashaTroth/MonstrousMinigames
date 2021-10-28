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
    CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE,
    CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_SKIPPED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD, CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__STUNNABLE_PLAYERS, CATCH_FOOD_GAME_EVENT_MESSAGES,
    GameOneEventMessage
} from './interfaces/GameOneEventMessages';

@singleton()
export class GameOneEventMessageEmitter implements EventMessageEmitter {
    constructor(private readonly gameEventEmitter: GameEventEmitter) {}

    emit(message: GameOneEventMessage | GlobalEventMessage): void {
        this.gameEventEmitter.emit(GameEventEmitter.EVENT_MESSAGE_EVENT, message);
    }
    canHandle(message: EventMessage, game: Game<Player, IGameStateBase>): boolean {
        return CATCH_FOOD_GAME_EVENT_MESSAGES.includes(message.type);
    }
    handle(controllerNameSpace: Namespace, screenNameSpace: Namespace, room: Room, message: GameOneEventMessage): void {
        let user: User;

        switch (message.type) {
            // send to single user's controller
            case CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES:
                user = room.getUserById(message.userId);
                if (!user) {
                    break;
                }
                controllerNameSpace.to(user.socketId).emit('message', message);
                break;

            //send to room's controllers
            case CATCH_FOOD_GAME_EVENT_MESSAGE__STUNNABLE_PLAYERS:
                controllerNameSpace.to(room.id).emit('message', message);
                break;

            // send to room's screens
            case CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_SKIPPED:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED:
            case CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED:
                screenNameSpace.to(room.id).emit('message', message);
                break;
        }
    }
}
