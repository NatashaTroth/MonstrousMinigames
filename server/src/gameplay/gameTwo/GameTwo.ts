import Game from '../Game';
import Player from '../Player';
import { GameState } from '../enums';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import User from '../../classes/user';
import { GameNames } from '../../enums/gameNames';
import { IMessage } from '../../interfaces/messages';
import { GameType } from '../leaderboard/enums/GameType';

import GameTwoPlayer from './GameTwoPlayer';
import { GameStateInfo } from './interfaces';

import Brightness from './classes/Brightness';
import GameTwoEventEmitter from './classes/GameTwoEventEmitter';
import GuessingService from './classes/GuessingServices';
import RoundEventEmitter from './classes/RoundEventEmitter';
import RoundService from './classes/RoundService';
import SheepService from './classes/SheepService';
import Parameters from './constants/Parameters';
import { GameTwoMessageTypes } from './enums/GameTwoMessageTypes';
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
    private brightness: Brightness

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
        this.brightness = new Brightness();

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
            sheep: this.sheepService.getSheepData(),
            lengthX: this.lengthX,
            lengthY: this.lengthY,
            round: this.roundService.round,
            phase: this.roundService.phase,
            timeLeft: this.roundService.getTimeLeft(),
            aliveSheepCounts: this.guessingService.counts,
            brightness: this.brightness.value
        };
    }

    protected mapUserToPlayer(user: User): GameTwoPlayer {
        const player = new GameTwoPlayer(
            user.id,
            user.name,
            user.number,
            Parameters.KILLS_PER_ROUND,
            user.characterNumber
        );
        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        if (this.roundService.isCountingPhase()) this.sheepService.update();
    }
    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        return;
    }
    protected beforeCreateNewGame() {
        return;
    }

    createNewGame(users: Array<User>) {
        super.createNewGame(users);
        this.resetPlayerPositions();
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
        this.roundService.pause();
        this.stopPlayersMoving();
        this.sheepService.stopMoving();
        this.brightness.stop();
        GameTwoEventEmitter.emitGameHasPausedEvent(this.roomId);
    }

    resumeGame(): void {
        super.resumeGame();
        this.roundService.resume();
        this.setPlayersMoving();
        this.sheepService.startMoving();
        this.brightness.start(false);
        GameTwoEventEmitter.emitGameHasResumedEvent(this.roomId);
    }

    stopGameUserClosed() {
        super.stopGameUserClosed();
        GameTwoEventEmitter.emitGameHasStoppedEvent(this.roomId);
        this.cleanup();
    }

    stopGameAllUsersDisconnected() {
        super.stopGameAllUsersDisconnected();
        this.cleanup();
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
                GameTwoEventEmitter.emitRemainingKills(this.roomId, userId, player.killsLeft);
            }
        }
    }

    protected handleGuess(userId: string, guess: number) {
        const player = this.players.get(userId)!;
        const round = this.roundService.round;

        if (this.roundService.isGuessingPhase() && player) {
            if (this.guessingService.addGuess(round, guess, userId)) {
                const hint = this.guessingService.getHintForRound(round, userId);
                GameTwoEventEmitter.emitGuessHint(this.roomId, player.id, hint);
                if (this.guessingService.allGuessesSubmitted(round)) this.roundService.skipPhase();
            }
        }

    }

    protected handleInput(message: IMessage) {
        switch (message.type) {
            case GameTwoMessageTypes.MOVE:
                //console.info(message)
                this.movePlayer(message.userId!, message.direction!);
                break;
            case GameTwoMessageTypes.KILL:
                // console.info(message)
                this.killSheep(message.userId!);
                break;
            case GameTwoMessageTypes.GUESS:
                // console.info(message)
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
            if (phase === Phases.COUNTING) {
                this.initCountingPhase();
            } else if (phase === Phases.GUESSING) {
                this.initGuessingPhase(round);
            } else if (phase === Phases.RESULTS) {
                this.initResultsPhase();
            }
            GameTwoEventEmitter.emitPhaseHasChanged(this.roomId, round, phase);
        });

        this.roundEventEmitter.on(RoundEventEmitter.GAME_FINISHED_EVENT, () => this.handleGameFinished());
    }

    protected initCountingPhase(): void {
        this.setPlayersMoving();
        this.emitPlayerRemainingKills();
        this.sheepService.startMoving()
        this.brightness.start();
    }

    protected initGuessingPhase(round: number): void {
        this.stopPlayersMoving();
        this.resetPlayerPositions();
        this.sheepService.stopMoving();
        this.brightness.stop();
        this.guessingService.saveSheepCount(round, this.sheepService.getAliveSheepCount());
    }

    protected initResultsPhase(): void {
        this.guessingService.calculatePlayerRanks();
        GameTwoEventEmitter.emitPlayerRanks(this.roomId, this.guessingService.getPlayerRanks())
    }

    protected handleGameFinished(): void {
        const playerRanks = this.guessingService.getPlayerRanks();

        this.leaderboard.addGameToHistory(GameType.GameTwo, [...playerRanks]);
        this.gameState = GameState.Finished;

        GameTwoEventEmitter.emitGameHasFinishedEvent(this.roomId, this.gameState, playerRanks);
    }

    public cleanup() {
        this.roundEventEmitter.removeAllListeners();
    }

    protected stopPlayersMoving(): void {
        [...this.players].forEach(player => player[1].moving = false);
    }

    protected setPlayersMoving(): void {
        [...this.players].forEach(player => player[1].moving = true);
    }

    protected resetPlayerPositions(): void {
        [...this.players].forEach(player => player[1].setPlayerPosition());
    }

    protected emitPlayerRemainingKills(): void {
        [...this.players].forEach(player => GameTwoEventEmitter.emitRemainingKills(this.roomId, player[0], player[1].killsLeft));
    }
}
