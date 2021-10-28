import { Namespace, Socket } from 'socket.io';

import { MessageTypes } from '../enums/messageTypes';
import Game from '../gameplay/Game';
import { CatchFoodMsgType } from '../gameplay/gameOne/enums';
// import { GameThreeMessageTypes } from '../gameplay/gameThree/enums/GameThreeMessageTypes';
// import { GameTwoMessageTypes } from '../gameplay/gameTwo/enums/GameTwoMessageTypes';
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
            console.info(this.room.id + ' | Screen connected | ' + this.socket.id);
            this.emitter.sendScreenState(this.screenNamespace, this.room?.getScreenState());

            this.emitter.sendConnectedUsers([this.screenNamespace], this.room);
            this.emitter.sendScreenAdmin(this.screenNamespace, this.socket.id, this.room.isAdminScreen(this.socket.id));

            this.socket.on('disconnect', this.onDisconnect.bind(this));
            this.socket.on('message', this.onMessage.bind(this));
        } catch (e: any) {
            this.emitter.sendErrorMessage(this.socket, e);
            console.error(this.roomId + ' | Screen Error 1 | ' + e.name);
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
                case MessageTypes.CHOOSE_GAME:
                    if (this.room?.isAdminScreen(this.socket.id) && message.game) {
                        console.info(this.room.id + ' | Choose Game' + ' | ' + message.game);
                        //todo error handling
                        this.room?.setGame(message.game);

                        this.emitter.sendGameSet(
                            [this.controllerNamespace, this.screenNamespace],
                            this.room,
                            message.game
                        );
                    }
                    break;
                case MessageTypes.START:
                    if (this.room?.isCreated() && this.room.isAdminScreen(this.socket.id)) {
                        this.room.startGame();

                        this.room.game.addListener(Game.EVT_FRAME_READY, (game: Game) => {
                            if (this.room?.isPlaying() && this.room?.game.sendGameStateUpdates) {
                                this.emitter.sendGameState(this.screenNamespace, this.room, false);
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
                case MessageTypes.SCREEN_STATE:
                    if (this.room?.isAdminScreen(this.socket.id) && message.state) {
                        console.info(this.room.id + ' | Send Screen State' + ' | ' + message.state);
                        this.room?.setScreenState(message.state);
                        this.emitter.sendScreenState(this.screenNamespace, this.room?.getScreenState());
                    }
                    break;
                case MessageTypes.CREATE:
                    if (this.room?.isOpen() && this.room.isAdminScreen(this.socket.id)) {
                        this.room.createNewGame();
                    }
                    break;
                // case GameThreeMessageTypes.CREATE:
                //     if (this.room?.isOpen() && this.room.isAdminScreen(this.socket.id)) {
                //         this.room.setGame(GameNames.GAME3);
                //         this.room.createNewGame();
                //     }
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
                default:
                    console.info(message);
            }
        } catch (e: any) {
            this.emitter.sendErrorMessage(this.socket, e);
            console.error(this.roomId + ' | Screen Error 2 |' + e.name);
            console.log(e);
        }
    }
    private onDisconnect() {
        console.info(this.room?.id + ' | Screen disconnected');
        this.room?.removeScreen(this.socket.id);

        if (this.room?.getAdminScreenId()) {
            this.emitter.sendScreenAdmin(this.screenNamespace, this.room.getAdminScreenId(), true);
        }
    }
}

export default Screen;
