import random from "random";

import User from "../../classes/user";
import { GameNames } from "../../enums/gameNames";
import { IMessage } from "../../interfaces/messages";
import Game from "../Game";
import { IGameInterface } from "../interfaces";
import Leaderboard from "../leaderboard/Leaderboard";
import Player from "../Player";
import GameTwoEventEmitter from "./classes/GameTwoEventEmitter";
import Sheep from "./classes/Sheep";
import InitialParameters from "./constants/InitialParameters";
import { GameTwoMessageTypes } from "./enums/GameTwoMessageTypes";
import { SheepStates } from "./enums/SheepStates";
import GameTwoPlayer from "./GameTwoPlayer";
import { GameStateInfo } from "./interfaces";

interface GameTwoGameInterface extends IGameInterface<GameTwoPlayer, GameStateInfo> {
    lengthX: number;
    lengthY: number;
}

export default class GameTwo extends Game<GameTwoPlayer, GameStateInfo> implements GameTwoGameInterface {
    public lengthX: number;
    public lengthY: number;
    public sheep: Sheep[];
    private currentSheepId: number;
    private roundTime: number;
    private roundCount: number;
    private currentRound: number;
    countdownTime = InitialParameters.COUNTDOWN_TIME;



    initialPlayerPositions = InitialParameters.PLAYERS_POSITIONS;

    gameName = GameNames.GAME2;

    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);
        this.gameStateMessage = GameTwoMessageTypes.GAME_STATE;
        this.lengthX = InitialParameters.LENGTH_X;
        this.lengthY = InitialParameters.LENGTH_Y;
        this.sheep = [];
        this.currentSheepId = 0;
        this.roundTime = InitialParameters.ROUND_TIME;
        this.roundCount = InitialParameters.ROUNDS;
        this.currentRound = 1;
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
            sheep: this.sheep,
            lengthX: this.lengthX,
            lengthY: this.lengthY,
            currentRound: this.currentRound,
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

    protected initSheep(count: number): void {
        const seedrandom = require('seedrandom');
        random.use(seedrandom('sheep'));

        for (let i = 0; i < count; i++) {
            let posX: number;
            let posY: number;
            do {
                posX = random.int(InitialParameters.MARGIN, InitialParameters.LENGTH_X - InitialParameters.MARGIN);
                posY = random.int(InitialParameters.MARGIN, InitialParameters.LENGTH_Y - InitialParameters.MARGIN);
            } while (!this.isValidStartingPosition(posX, posY));
            this.sheep.push(new Sheep(posX, posY, this.currentSheepId));
            this.currentSheepId++;
        }
    }

    protected isValidStartingPosition(posX: number, posY: number): boolean {
        let valid = true;

        this.players.forEach(player => {
            if (
                Math.abs(player.posX - posX) < InitialParameters.MARGIN ||
                Math.abs(player.posY - posY) < InitialParameters.MARGIN
            ) {
                valid = false;
                return;
            }
        });
        this.sheep.forEach(sheep => {
            if (
                Math.abs(sheep.posX - posX) < InitialParameters.MARGIN &&
                Math.abs(sheep.posY - posY) < InitialParameters.MARGIN
            ) {
                valid = false;
                return;
            }
        });

        return valid;
    }

    protected beforeCreateNewGame() {
        return;
    }

    createNewGame(users: Array<User>) {
        super.createNewGame(users);
        this.initSheep(InitialParameters.SHEEP_COUNT);
        GameTwoEventEmitter.emitInitialGameStateInfoUpdate(this.roomId, this.getGameStateInfo());
    }

    startGame(): void {
        setTimeout(() => {
            super.startGame();
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
        this.players.get(userId)!.setDirection(direction);
    }
    protected killSheep(userId: string) {
        const player = this.players.get(userId)!;

        if (player.killsLeft < 1) {
            return;
        }

        const sheepInRadius = this.sheep.filter(sheep => {
            return (
                sheep.state === SheepStates.ALIVE &&
                Math.abs(sheep.posX - player.posX) <= InitialParameters.KILL_RADIUS &&
                Math.abs(sheep.posY - player.posY) <= InitialParameters.KILL_RADIUS
            );
        });

        this.sheep.forEach(sheep => {
            Math.abs(sheep.posX - player.posX) <= InitialParameters.KILL_RADIUS &&
                Math.abs(sheep.posY - player.posY) <= InitialParameters.KILL_RADIUS;
        });

        if (sheepInRadius.length < 1) {
            return;
        } else if (sheepInRadius.length === 1) {
            const sheepId = sheepInRadius[0].id;
            this.sheep[sheepId].state = SheepStates.DECOY;
            /* find the closest sheep in radius */
        } else {
            let sheepId = sheepInRadius[0].id;
            let minDistance = 1 + InitialParameters.KILL_RADIUS * 2;
            let currentDistance;
            sheepInRadius.forEach(sheep => {
                currentDistance = Math.abs(sheep.posX - player.posX) + Math.abs(sheep.posY - player.posY);
                if (currentDistance < minDistance) {
                    minDistance = currentDistance;
                    sheepId = sheep.id;
                }
            });

            this.sheep[sheepId].state = SheepStates.DECOY;
        }
        player.killsLeft--;
    }


    protected handleGuess(userId: string, guess: number) {
        const player = this.players.get(userId)!;

        // todo handle if player not found

        // todo handle if guess exists for round

        player.guesses.push({round: this.currentRound, guess: guess});
    
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
