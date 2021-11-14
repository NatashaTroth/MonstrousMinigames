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
import { NamespaceAdapter } from './interfaces';
import {
    GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE,
    GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE,
    GAME_ONE_EVENT_MESSAGE__CHASERS_WERE_PUSHED,
    GAME_ONE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    GAME_ONE_EVENT_MESSAGE__OBSTACLE_REACHED, GAME_ONE_EVENT_MESSAGE__OBSTACLE_SKIPPED,
    GAME_ONE_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED,
    GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES,
    GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_FINISHED, GAME_ONE_EVENT_MESSAGE__PLAYER_IS_DEAD,
    GAME_ONE_EVENT_MESSAGE__PLAYER_IS_STUNNED, GAME_ONE_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED,
    GAME_ONE_EVENT_MESSAGE__STUNNABLE_PLAYERS, GAME_ONE_EVENT_MESSAGES, GameOneEventMessage
} from './interfaces/GameOneEventMessages';

@singleton()
export class GameOneEventMessageEmitter implements EventMessageEmitter {
    constructor(private readonly gameEventEmitter: GameEventEmitter) {}

    emit(message: GameOneEventMessage | GlobalEventMessage): void {
        this.gameEventEmitter.emit(GameEventEmitter.EVENT_MESSAGE_EVENT, message);
    }
    canHandle(message: EventMessage, game: Game<Player, IGameStateBase>): boolean {
        return GAME_ONE_EVENT_MESSAGES.includes(message.type);
    }
    handle(
        controllerNameSpace: NamespaceAdapter,
        screenNameSpace: NamespaceAdapter,
        room: Room,
        message: GameOneEventMessage
    ): void {
        let user: User;

        switch (message.type) {
            // send to single user's controller
            case GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE:
            case GAME_ONE_EVENT_MESSAGE__OBSTACLE_REACHED:
            case GAME_ONE_EVENT_MESSAGE__PLAYER_IS_STUNNED:
            case GAME_ONE_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED:
            case GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_FINISHED:
            case GAME_ONE_EVENT_MESSAGE__PLAYER_IS_DEAD:
            case GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES:
                user = room.getUserById(message.userId);
                if (!user) {
                    break;
                }
                controllerNameSpace.to(user.socketId).emit('message', message);
                break;

            //send to room's controllers
            case GAME_ONE_EVENT_MESSAGE__STUNNABLE_PLAYERS:
                controllerNameSpace.to(room.id).emit('message', message);
                break;

            // send to room's screens
            case GAME_ONE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE:
            case GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE:
            case GAME_ONE_EVENT_MESSAGE__OBSTACLE_SKIPPED:
            case GAME_ONE_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED:
            case GAME_ONE_EVENT_MESSAGE__CHASERS_WERE_PUSHED:
                screenNameSpace.to(room.id).emit('message', message);
                break;
        }
    }
}
