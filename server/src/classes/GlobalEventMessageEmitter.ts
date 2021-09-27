import { Namespace } from 'socket.io';
import { singleton } from 'tsyringe';
import Game from '../gameplay/Game';
import {
    GlobalEventMessage,
    GLOBAL_EVENT_MESSAGES,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED,
    GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
} from '../gameplay/interfaces/GlobalEventMessages';
import { IGameStateBase } from '../gameplay/interfaces/IGameStateBase';
import Player from '../gameplay/Player';
import { EventMessage } from '../interfaces/EventMessage';
import { EventMessageEmitter } from '../interfaces/EventMessageEmitter';
import GameEventEmitter from './GameEventEmitter';
import Room from './room';

@singleton()
export class GlobalEventMessageEmitter implements EventMessageEmitter {
    constructor(private readonly gameEventEmitter: GameEventEmitter) {}

    emit(message: GlobalEventMessage): void {
        this.gameEventEmitter.emit(GameEventEmitter.EVENT_MESSAGE_EVENT, message);
    }
    canHandle(message: EventMessage, game: Game<Player, IGameStateBase>): boolean {
        return GLOBAL_EVENT_MESSAGES.includes(message.type);
    }
    handle(controllerNameSpace: Namespace, screenNameSpace: Namespace, room: Room, message: GlobalEventMessage): void {
        switch (message.type) {
            case GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED:
                controllerNameSpace.to(room.id).emit('message', message);
                screenNameSpace.to(room.id).emit('message', message);
                break;
            case GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED:
                room.setFinished();
                controllerNameSpace.to(room.id).emit('message', message);
                screenNameSpace.to(room.id).emit('message', message);
                break;
            case GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED:
                room.setOpen();
                controllerNameSpace.to(room.id).emit('message', message);
                screenNameSpace.to(room.id).emit('message', message);
                break;
            case GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED:
                room.setPaused();
                controllerNameSpace.to(room.id).emit('message', message);
                screenNameSpace.to(room.id).emit('message', message);
                break;
            case GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED:
                room.setPlaying();
                controllerNameSpace.to(room.id).emit('message', message);
                screenNameSpace.to(room.id).emit('message', message);
                break;
            case GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED:
                screenNameSpace.to(room.id).emit('message', message);
                break;
        }
    }
}
