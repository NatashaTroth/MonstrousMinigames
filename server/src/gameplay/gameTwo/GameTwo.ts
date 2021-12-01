import User from '../../classes/user';
import { IMessage } from '../../interfaces/messages';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import Parameters from './constants/Parameters';
import { GameTwoMessageTypes } from './enums/GameTwoMessageTypes';
import GameTwoEventEmitter from './classes/GameTwoEventEmitter';
import GameTwoPlayer from './GameTwoPlayer';
import { GameStateInfo } from './interfaces';
import { GameNames } from '../../enums/gameNames';
import RoundService from './classes/RoundService';
import SheepService from './classes/SheepService';
import RoundEventEmitter from './classes/RoundEventEmitter';
import GuessingService from './classes/GuessingServices';
import { Phases } from './enums/Phases';

interface GameTwoGameInterface extends IGameInterface<GameTwoPlayer, GameStateInfo> {
    lengthX: number;
    lengthY: number;
}

export default class GameTwo extends Game<GameTwoPlayer, GameStateInfo> implements GameTwoGameInterface {
    public lengthX: number;
    public lengthY: number;
    countdownTime = Parameters.COUNTDOWN_TIME;
    public sheepService: SheepService;
    private roundService: RoundService;
    private roundEventEmitter: RoundEventEmitter;
    private guessingService: GuessingService;

    initialPlayerPositions = Parameters.PLAYERS_POSITIONS;

    gameName = GameNames.GAME2;

    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);
        this.gameStateMessage = GameTwoMessageTypes.GAME_STATE;
        this.lengthX = Parameters.LENGTH_X;
        this.lengthY = Parameters.LENGTH_Y;
        this.sheepService = new SheepService(Parameters.SHEEP_COUNT);
        this.roundService = new RoundService();
        this.roundEventEmitter = RoundEventEmitter.getInstance();
        this.guessingService = new GuessingService(Parameters.ROUNDS);

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
            sheep: this.sheepService.sheep,
            lengthX: this.lengthX,
            lengthY: this.lengthY,
            round: this.roundService.round,
            phase: this.roundService.phase,
            aliveSheepCounts: this.guessingService.counts
        };
    }

    protected mapUserToPlayer(user: User): GameTwoPlayer {
        const player = new GameTwoPlayer(
            user.id,
            user.name,
            this.initialPlayerPositions[user.number].x,
            this.initialPlayerPositions[user.number].y,
            Parameters.KILLS_PER_ROUND,
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
        this.guessingService.init(users);
        this.listenToEvents();
        GameTwoEventEmitter.emitInitialGameStateInfoUpdate(
            this.roomId,
            this.getGameStateInfo()
        )
    }

    startGame(): void {
        setTimeout(() => {
            super.startGame();
            this.roundService.start();
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
            player.direction = direction;
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
        const round = this.roundService.round;

        if (this.roundService.isGuessingPhase() && player) {
            if (this.guessingService.addGuess(round, guess, userId)) {
                const hint = this.guessingService.getHintForRound(round, userId);
                if (hint) {
                    GameTwoEventEmitter.emitGuessHint(this.roomId, player.id, hint);
                }
            }
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

    protected listenToEvents(): void {
        this.roundEventEmitter.on(RoundEventEmitter.PHASE_CHANGE_EVENT, (round: number, phase: string) => {
            if (phase === Phases.GUESSING) {
                this.guessingService.saveSheepCount(round, this.sheepService.getAliveSheepCount());
            } else if (phase === Phases.RESULTS) {
                this.guessingService.calculatePlayerRanks();
                GameTwoEventEmitter.emitPlayerRanks(this.roomId, this.guessingService.getPlayerRanks())
            }
            GameTwoEventEmitter.emitPhaseHasChanged(this.roomId, round, phase);
        });
    }
}
