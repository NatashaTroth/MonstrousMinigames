import { Namespace, Socket } from 'socket.io';
import { inject, singleton } from 'tsyringe';

import Controller from '../classes/Controller';
import GameEventEmitter from '../classes/GameEventEmitter';
import Screen from '../classes/Screen';
import SocketIOServer from '../classes/SocketIOServer';
import { DI_EVENT_MESSAGE_EMITTERS } from '../di';
import { Namespaces } from '../enums/nameSpaces';
import emitter from '../helpers/emitter';
import { EventMessage } from '../interfaces/EventMessage';
import { EventMessageEmitter } from '../interfaces/EventMessageEmitter';
import RoomService from './roomService';

@singleton()
class ConnectionHandler {
    private controllerNamespace: Namespace;
    private screenNameSpace: Namespace;

    constructor(
        private readonly socketIOServer: SocketIOServer,
        private readonly roomService: RoomService,
        private readonly gameEventEmitter: GameEventEmitter,
        @inject(DI_EVENT_MESSAGE_EMITTERS) private readonly eventMessageEmitters: EventMessageEmitter[]
    ) {
        this.controllerNamespace = this.socketIOServer.socketIo.of(Namespaces.CONTROLLER);
        this.screenNameSpace = this.socketIOServer.socketIo.of(Namespaces.SCREEN);
    }

    public handle(): void {
        this.handleControllers();
        this.handleScreens();
        this.handleGameEvents();
    }

    public shutdown(): void {
        this.controllerNamespace.removeAllListeners();
        this.screenNameSpace.removeAllListeners();
        this.socketIOServer.socketIo.removeAllListeners();
        this.gameEventEmitter.removeAllListeners();
    }
    private handleControllers() {
        this.controllerNamespace.on('connection', (socket: Socket) => {
            const controller = new Controller(
                socket,
                this.roomService,
                emitter,
                this.controllerNamespace,
                this.screenNameSpace
            );
            controller.init();
        });
    }
    private handleScreens() {
        this.screenNameSpace.on('connection', (socket: Socket) => {
            const screen = new Screen(
                socket,
                this.roomService,
                emitter,
                this.screenNameSpace,
                this.controllerNamespace
            );
            screen.init();
        });
    }
    private handleGameEvents() {
        this.gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: EventMessage) => {
            const room = this.roomService.getRoomById(message.roomId);
            const game = room?.game;

            if (!room || !game) return;

            this.eventMessageEmitters
                .filter(emitter => emitter.canHandle(message, game))
                .forEach(emitter => emitter.handle(this.controllerNamespace, this.screenNameSpace, room, message));
        });
    }
}

export default ConnectionHandler;
