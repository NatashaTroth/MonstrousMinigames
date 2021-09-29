import random from 'random';

import User from '../../classes/user';
import { IMessage } from '../../interfaces/messages';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import Sheep from './classes/Sheep';
import InitialParameters from './constants/InitialParameters';
import { GameTwoMessageTypes } from './enums/GameTwoMessageTypes';
import { SheepStates } from './enums/SheepStates';
import GameTwoPlayer from './GameTwoPlayer';
import { GameStateInfo } from './interfaces/GameStateInfo';

/*
- sheepCount
- position for every user
- position for every sheep
- movement
- decoys



class Sheep {
    posX
    posY
    isDead
}

getSheepCount



*/

interface GameTwoGameInterface extends IGameInterface<GameTwoPlayer, GameStateInfo> {
    lengthX: number;
    lengthY: number;
}

export default class GameTwo extends Game<GameTwoPlayer, GameStateInfo> implements GameTwoGameInterface {
    public lengthX: number;
    public lengthY: number;
    public sheep: Sheep[];
    private currentSheepId: number;
    countdownTime = InitialParameters.COUNTDOWN_TIME;

    initialPlayerPositions = InitialParameters.PLAYERS_POSITIONS;

    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);
        this.lengthX = InitialParameters.LENGTH_X;
        this.lengthY = InitialParameters.LENGTH_Y;
        this.sheep = [];
        this.currentSheepId = 0;
        console.log('game2 created');
        console.info(this);
    }

    getGameStateInfo(): GameStateInfo {
        return {
            gameState: this.gameState,
            roomId: this.roomId,
        };
    }

    protected beforeCreateNewGame() {
        throw new Error('Method not implemented.');
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
        console.info(player);
        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        console.error('Unimplemented Method');
    }
    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        console.error('Unimplemented Method');
    }

    protected initSheep(count: number): void {
        const seedrandom = require('seedrandom');
        random.use(seedrandom('sheep'));

        for (let i = 0; i <= count; i++) {
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
    createNewGame(users: Array<User>) {
        super.createNewGame(users);
        this.initSheep(InitialParameters.SHEEP_COUNT);
        console.info(this.sheep);
    }

    startGame(): void {
        setTimeout(() => {
            super.startGame();
        }, this.countdownTime);
    }
    pauseGame(): void {
        super.pauseGame();
    }

    resumeGame(): void {
        super.resumeGame();
    }

    stopGameUserClosed() {
        super.stopGameUserClosed();
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
        }
        if (sheepInRadius.length >= 1) {
            const sheepId = sheepInRadius[0].id;
            this.sheep[sheepId].state = SheepStates.DECOY;
            //todo how to handle if multiple sheep
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
            default:
                console.info(message);
        }
    }
}
