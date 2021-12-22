import { Namespace } from 'socket.io';

import Room from '../classes/room';
import Game from '../gameplay/Game';

import { EventMessage } from './EventMessage';

export interface EventMessageEmitter {
    canHandle(message: EventMessage, game: Game): boolean;
    handle(controllerNameSpace: Namespace, screenNameSpace: Namespace, room: Room, message: EventMessage): void;
    emit(message: EventMessage): void;
    removeAllListeners(): void;
}
