import { Namespace, Socket } from 'socket.io';

import { MessageTypes } from '../enums/messageTypes';
import Game from '../gameplay/Game';
import { IMessage } from '../interfaces/messages';
import RoomService from '../services/roomService';
import Room from './room';
import User from './user';

class Controller {
    protected name: string | null = null;
    protected roomId: string | null = null;
    protected room: Room | null = null;
    protected user: User | null = null;
    protected game: Game | null = null;

    constructor(
        protected socket: Socket,
        protected roomService: RoomService,
        protected emitter: typeof import('../helpers/emitter').default,
        protected controllerNamespace: Namespace,
        protected screenNamespace: Namespace
    ) {}

    init() {
        try {
            this.name = (this.socket.handshake.query as Record<string, string>).name;
            this.roomId = (this.socket.handshake.query as Record<string, string>).roomId;
            this.room = this.roomService.getRoomById(this.roomId);
            this.socket.join(this.room.id);

            this.user = this.findOrCreateUser(
                (this.socket.handshake.query as Record<string, string | undefined>).userId
            );
            this.emitter.sendConnectedUsers([this.controllerNamespace, this.screenNamespace], this.room!);
            this.emitter.sendUserInit(this.socket, this.user, this.room, this.room?.getScreenState());
            console.info(this.room.id + ' | Controller connected: ' + this.user.id);

            this.socket.on('disconnect', this.onDisconnect.bind(this));
            this.socket.on('message', this.onMessage.bind(this));
        } catch (e: any) {
            this.emitter.sendErrorMessage(this.socket, e);
            console.error(this.roomId + ' | Controller Error 1 | ' + e.name);
        }
    }
    private async onMessage(message: IMessage) {
        try {
            switch (message.type) {
                case MessageTypes.SELECT_CHARACTER:
                    if (message.characterNumber !== null && message.characterNumber !== undefined) {
                        this.room?.setUserCharacter(this.user!, parseInt(message.characterNumber, 10));
                        this.emitter.sendConnectedUsers([this.controllerNamespace, this.screenNamespace], this.room!);
                    }
                    break;
                case MessageTypes.USER_READY:
                    if (this.room?.isOpen() && this.user) {
                        this.user.setReady(!this.user.isReady());
                        console.info(this.room.id + ' | userId: ' + this.user.id + ' | Ready: ' + this.user.isReady());
                        this.emitter.sendConnectedUsers([this.controllerNamespace, this.screenNamespace], this.room);
                    }
                    break;
                default:
                    if (this.user?.id && this.user?.id !== message.userId) {
                        message.userId = this.user?.id;
                    }

                    await this.room?.game.receiveInput(message);
            }
        } catch (e: any) {
            this.emitter.sendErrorMessage(this.socket, e);
            console.error(this.roomId + ' | Controller Error 2 | ' + e.name);
        }
    }
    private onDisconnect() {
        console.info(this.room!.id + ' | Controller disconnected: ' + this.user!.id);

        try {
            this.room?.userDisconnected(this.user!.id);
        } catch (e: any) {
            this.emitter.sendErrorMessage(this.socket, e);
            console.error(this.roomId + ' | Controller Error 3 | ' + e.name + ' | ' + this.user?.id);
            return;
        }

        if (this.room?.isOpen()) {
            this.emitter.sendConnectedUsers([this.controllerNamespace, this.screenNamespace], this.room!);
        }
    }
    private findOrCreateUser(userId?: string) {
        const user = userId ? this.room?.getUserById(userId) : null;

        if (!user) {
            const newUser = new User(this.room!.id, this.socket.id, this.name!);
            this.room?.addUser(newUser);

            return newUser;
        }

        user.setRoomId(this.room!.id);
        user.setSocketId(this.socket.id);
        user.setActive(true);

        return user;
    }
}

export default Controller;
