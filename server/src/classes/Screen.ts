import { Namespace, Socket } from 'socket.io';

import { MessageTypes } from '../enums/messageTypes';
import { CatchFoodMsgType } from '../gameplay/catchFood/enums';
import Game from '../gameplay/Game';
import { IMessage } from '../interfaces/messages';
import RoomService from '../services/roomService';
import Room from './room';

class Screen {
    protected roomId?: string;
    protected room?: Room;
    public phaserGameReady: boolean;

    constructor(
        protected socket: Socket,
        protected roomService: RoomService,
        protected emitter: typeof import('../helpers/emitter').default,
        protected screenNamespace: Namespace,
        protected controllerNamespace: Namespace
    ) {
        this.phaserGameReady = false;
    }

    init() {
        try {
            this.roomId = (this.socket.handshake.query as Record<string, string | undefined>).roomId;
            this.room = this.roomService.getRoomById(this.roomId!);
            this.room.addScreen(this.socket.id);
            this.socket.join(this.room.id);
            console.info(this.room.id + ' | Screen connected');

            this.emitter.sendConnectedUsers([this.screenNamespace], this.room);
            if (this.room.isAdminScreen(this.socket.id)) {
                this.emitter.sendScreenAdmin(this.screenNamespace, this.socket.id);
            }

            this.socket.on('disconnect', this.onDisconnect.bind(this));
            this.socket.on('message', this.onMessage.bind(this));
        } catch (e) {
            this.emitter.sendErrorMessage(this.socket, e);
            console.error(this.roomId + ' | ' + e.name);
        }
    }

    private trySendAllScreensPhaserGameLoaded(timedOut = false) {
        if (!this.room!.sentAllScreensLoaded) {
            this.room!.sentAllScreensLoaded = true;
            if (this.room?.allScreensLoadedTimeout) clearTimeout(this.room.allScreensLoadedTimeout);
            this.emitter.sendAllScreensPhaserGameLoaded([this.screenNamespace], this.room!);
        }

        if (timedOut) {
            console.log('sending timed out');
            const notReadyScreens = this.room!.getScreensPhaserNotReady();
            notReadyScreens.forEach(screen => {
                this.emitter.sendScreenPhaserGameLoadedTimedOut(this.screenNamespace, screen.id); //TODO natasha
            });
        }
    }

    private onMessage(message: IMessage) {
        try {
            switch (message.type) {
                case CatchFoodMsgType.PHASER_GAME_LOADED:
                    this.room?.setScreenPhaserGameReady(this.socket.id, true);
                    if (this.room && !this.room?.firstPhaserScreenLoaded) {
                        this.room.firstPhaserScreenLoaded = true;
                        this.room.allScreensLoadedTimeout = setTimeout(() => {
                            this.trySendAllScreensPhaserGameLoaded(true);
                            ///TODO natasha - send timedout to other screens
                        }, 10000);
                    }

                    if (this.room?.allPhaserGamesReady()) {
                        this.trySendAllScreensPhaserGameLoaded();
                    }
                    break;
                case CatchFoodMsgType.START_PHASER_GAME:
                    this.emitter.sendStartPhaserGame([this.screenNamespace], this.room!);
                    break;
                case CatchFoodMsgType.CREATE:
                    if (this.room?.isOpen() && this.room.isAdminScreen(this.socket.id)) {
                        this.room.createNewGame();
                    }
                    break;
                case CatchFoodMsgType.START:
                    if (this.room?.isCreated() && this.room.isAdminScreen(this.socket.id)) {
                        // this.room.createNewGame();
                        this.room.startGame();
                        // this.emitter.sendGameState(this.screenNamespace, this.room);

                        this.room.game.addListener(Game.EVT_FRAME_READY, (game: Game) => {
                            if (this.room?.isPlaying()) {
                                this.emitter.sendGameState(this.screenNamespace, this.room, true);
                            }
                        });
                    }
                    break;
                case MessageTypes.PAUSE_RESUME:
                    console.log('received pause resume message');
                    if (this.room?.isPlaying()) {
                        console.info(this.room.id + ' | Pause Game');
                        this.room.pauseGame();
                        break;
                    }
                    if (this.room?.isPaused()) {
                        console.info(this.room.id + ' | Resume Game');
                        this.room.resumeGame();
                    }
                    break;
                case MessageTypes.STOP_GAME:
                    if (this.room?.isPlaying() || this.room?.isPaused()) {
                        console.info(this.room.id + ' | Stop Game');
                        this.room.stopGame();
                    }
                    break;
                case MessageTypes.BACK_TO_LOBBY:
                    if (this.room?.isAdminScreen(this.socket.id)) {
                        console.info(this.room.id + ' | Reset Game');
                        this.room!.setAllScreensPhaserGameReady(false);
                        this.room!.sentAllScreensLoaded = false;
                        this.room.resetGame().then(() => {
                            this.emitter.sendMessage(
                                MessageTypes.GAME_HAS_RESET,
                                [this.controllerNamespace, this.screenNamespace],
                                this.room!.id
                            );
                            this.emitter.sendConnectedUsers(
                                [this.controllerNamespace, this.screenNamespace],
                                this.room!
                            );
                        });
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
        console.info(this.room?.id + ' | Screen disconnected');
        this.room?.removeScreen(this.socket.id);

        if (this.room?.getAdminScreenId()) {
            this.emitter.sendScreenAdmin(this.screenNamespace, this.room.getAdminScreenId());
        }
    }
}

export default Screen;
