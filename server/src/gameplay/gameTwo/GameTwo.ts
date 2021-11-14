import User from '../../classes/user';
import { IMessage } from '../../interfaces/messages';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import InitialParameters from './constants/InitialParameters';
import { GameTwoMessageTypes } from './enums/GameTwoMessageTypes';
import GameTwoEventEmitter from './classes/GameTwoEventEmitter';
import GameTwoPlayer from './GameTwoPlayer';
import { GameStateInfo } from './interfaces';
import { GameNames } from '../../enums/gameNames';
import RoundService from './classes/RoundService';
import SheepService from './classes/SheepService';

interface GameTwoGameInterface extends IGameInterface<GameTwoPlayer, GameStateInfo> {
    lengthX: number;
    lengthY: number;
}

export default class GameTwo extends Game<GameTwoPlayer, GameStateInfo> implements GameTwoGameInterface {
    public lengthX: number;
    public lengthY: number;
    countdownTime = InitialParameters.COUNTDOWN_TIME;
    public sheepService: SheepService;
    private roundService: RoundService;

    initialPlayerPositions = InitialParameters.PLAYERS_POSITIONS;

    gameName = GameNames.GAME2;

    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);
        this.gameStateMessage = GameTwoMessageTypes.GAME_STATE;
        this.lengthX = InitialParameters.LENGTH_X;
        this.lengthY = InitialParameters.LENGTH_Y;
        this.sheepService = new SheepService(InitialParameters.SHEEP_COUNT);
        this.roundService = new RoundService();
    }

    getGameStateInfo(): GameStateInfo {
        return {
            gameState: this.gameState,
            roomId: this.roomId,
            playersState: Array.from(this.players.values()).map(player => ({
                id: player.id,
                name: player.name,
                positionX: player.posX,
                positionY: player.posY,
                finished: player.finished,
                isActive: player.isActive,
                characterNumber: player.characterNumber,
            })),
            sheep: this.sheepService.getSheep(),
            lengthX: this.lengthX,
            lengthY: this.lengthY,
            round: this.roundService.getRound(),
            phase: this.roundService.getPhase(),
        };
    }

    protected mapUserToPlayer(user: User): GameTwoPlayer {
        const player = new GameTwoPlayer(
            user.id,
            user.name,
            this.initialPlayerPositions[user.number].x,
            this.initialPlayerPositions[user.number].y,
            InitialParameters.KILLS_PER_ROUND,
            user.characterNumber
        );
        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        return;
    }
    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        return;
    }
    protected beforeCreateNewGame() {
        return;
    }

    createNewGame(users: Array<User>) {
        super.createNewGame(users);
        this.sheepService.initSheep();
        GameTwoEventEmitter.emitInitialGameStateInfoUpdate(
            this.roomId,
            this.getGameStateInfo()
        )
    }

    startGame(): void {
        setTimeout(() => {
            super.startGame();
            this.roundService.countingPhase();
        }, this.countdownTime);
        GameTwoEventEmitter.emitGameHasStartedEvent(this.roomId, this.countdownTime, this.gameName);
    }

    pauseGame(): void {
        super.pauseGame();
        GameTwoEventEmitter.emitGameHasPausedEvent(this.roomId);
    }

    resumeGame(): void {
        super.resumeGame();
        GameTwoEventEmitter.emitGameHasResumedEvent(this.roomId);
    }

    stopGameUserClosed() {
        super.stopGameUserClosed();
        GameTwoEventEmitter.emitGameHasStoppedEvent(this.roomId);
    }

    stopGameAllUsersDisconnected() {
        super.stopGameAllUsersDisconnected();
    }

    protected movePlayer(userId: string, direction: string) {
        const player = this.players.get(userId)!;
        if (this.roundService.isCountingPhase() && player) {
            player.setDirection(direction);
        }
    }
    protected killSheep(userId: string) {
        const player = this.players.get(userId)!;
        if (this.roundService.isCountingPhase() && player && player.killsLeft > 0) {
            if (this.sheepService.killSheep(player)) {
                player.killsLeft--;
            }
        }
    }


    protected handleGuess(userId: string, guess: number) {
        const player = this.players.get(userId)!;

        // todo handle if guess exists for round

        if (this.roundService.isGuessingPhase() && player && !player.getGuessForRound(this.roundService.getRound())) {
            player.addGuess(this.roundService.getRound(), guess, this.sheepService.getAliveSheepCount());
        }

    }

    protected handleInput(message: IMessage) {
        switch (message.type) {
            case GameTwoMessageTypes.MOVE:
                this.movePlayer(message.userId!, message.direction!);
                break;
            case GameTwoMessageTypes.KILL:
                this.killSheep(message.userId!);
                break;
            case GameTwoMessageTypes.GUESS:
                this.handleGuess(message.userId!, message.guess!);
                break;
            default:
                console.info(message);
        }
    }

    disconnectPlayer(userId: string) {
        if (super.disconnectPlayer(userId)) {
            GameTwoEventEmitter.emitPlayerHasDisconnected(this.roomId, userId);
            return true;
        }

        return false;
    }

    reconnectPlayer(userId: string) {
        if (super.reconnectPlayer(userId)) {
            GameTwoEventEmitter.emitPlayerHasReconnected(this.roomId, userId);

            return true;
        }

        return false;
    }
}
