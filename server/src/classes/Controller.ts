import { Namespace, Socket } from 'socket.io';
import { MessageTypes } from '../enums/messageTypes';
import { CatchFoodGame } from '../gameplay';
import { CatchFoodMsgType } from '../gameplay/catchFood/enums';
import Game from '../gameplay/Game';
import { IMessageObstacle } from '../interfaces/messageObstacle';
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
            this.emitter.sendUserInit(this.socket, this.user, this.room);
            console.info(this.room.id + ' | Controller connected: ' + this.user.id);

            this.socket.on('disconnect', this.onDisconnect.bind(this));
            this.socket.on('message', this.onMessage.bind(this));
        } catch (e) {
            this.emitter.sendErrorMessage(this.socket, e);
            console.error(this.roomId + ' | ' + e.name);
        }
    }
    private onMessage(message: IMessage) {
        try {
            switch (message.type) {
                case CatchFoodMsgType.MOVE:
                    if (this.room?.isPlaying() && this.game instanceof CatchFoodGame) {
                        this.game.runForward(this.user!.id, parseInt(`${process.env.SPEED}`, 10) || 2);
                    }
                    break;
                case CatchFoodMsgType.OBSTACLE_SOLVED:
                    if (this.game instanceof CatchFoodGame) {
                        this.game.playerHasCompletedObstacle(this.user!.id, (message as IMessageObstacle).obstacleId);
                    }
                    break;
                case CatchFoodMsgType.STUN_PLAYER:
                    if (this.game instanceof CatchFoodGame && message.userId && message.receivingUserId) {
                        this.game.stunPlayer(message.receivingUserId, message.userId);
                    }
                    break;
                case MessageTypes.SELECT_CHARACTER:
                    if (message.characterNumber !== null && message.characterNumber !== undefined) {
                        this.room?.setUserCharacter(this.user!, parseInt(message.characterNumber, 10));
                        this.emitter.sendConnectedUsers([this.controllerNamespace, this.screenNamespace], this.room!);
                    }
                    break;
                case MessageTypes.USER_READY:
                    if (this.room?.isOpen() && this.user) {
                        this.user.setReady(!this.user.isReady);
                        console.info(this.room.id + ' | userId: ' + this.user.id + ' | Ready: ' + this.user.isReady());
                        this.emitter.sendConnectedUsers([this.controllerNamespace, this.screenNamespace], this.room);
                    }
                    break;
                default:
                    console.info(message);
            }
        } catch (e) {
            this.emitter.sendErrorMessage(this.socket, e);
            console.error(this.roomId + ' | ' + e.name);
        }
    }
    private onDisconnect() {
        console.info(this.room!.id + ' | Controller disconnected: ' + this.user!.id);

        try {
            this.room?.userDisconnected(this.user!.id);
        } catch (e) {
            this.emitter.sendErrorMessage(this.socket, e);
            console.error(this.roomId + ' | ' + e.name + ' | ' + this.user?.id);
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
