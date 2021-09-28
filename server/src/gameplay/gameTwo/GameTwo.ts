import User from '../../classes/user';
import { IMessage } from '../../interfaces/messages';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import GameTwoPlayer from './GameTwoPlayer';
import InitialParameters from './constants/InitialParameters'
import Sheep from './classes/Sheep';
import random from 'random';
import { GameStateInfo } from './interfaces/GameStateInfo';
import { GameTwoMessageTypes } from './enums/GameTwoMessageTypes';



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
    countdownTime = InitialParameters.COUNTDOWN_TIME;


    initialPlayerPositions = InitialParameters.PLAYERS_POSITIONS;

    getGameStateInfo(): GameStateInfo {
        return {
            gameState: this.gameState,
            roomId: this.roomId,
        };
    }
    protected mapUserToPlayer(user: User): GameTwoPlayer {
        const player = new GameTwoPlayer(user.id, user.name, this.initialPlayerPositions[user.number].x, this.initialPlayerPositions[user.number].y, user.characterNumber);
        console.info(player);
        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        console.error("Unimplemented Method")

    }
    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        console.error("Unimplemented Method")
    }



    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);
        this.lengthX = InitialParameters.LENGTH_X;
        this.lengthY = InitialParameters.LENGTH_Y;
        this.sheep = [];
        console.log('game2 created')
        console.info(this);
    }

    protected initSheep(count: number): void {
        const seedrandom = require('seedrandom')
        random.use(seedrandom('sheep'));

        for (let i = 0; i <= count; i++) {
            let posX: number;
            let posY: number;
            do {
                posX = random.int(InitialParameters.MARGIN, InitialParameters.LENGTH_X - InitialParameters.MARGIN);
                posY = random.int(InitialParameters.MARGIN, InitialParameters.LENGTH_Y - InitialParameters.MARGIN);
            } while (!this.isValidStartingPosition(posX, posY))
            this.sheep.push(new Sheep(posX, posY))
        }
    }

    protected isValidStartingPosition(posX: number, posY: number): boolean {
        let valid = true;

        this.players.forEach(player => {
            if (Math.abs(player.posX - posX) < InitialParameters.MARGIN || Math.abs(player.posY - posY) < InitialParameters.MARGIN) {
                valid = false;
                return
            }
        });
        this.sheep.forEach(sheep => {
            if ((Math.abs(sheep.posX - posX) < InitialParameters.MARGIN) && (Math.abs(sheep.posY - posY) < InitialParameters.MARGIN)) {
                valid = false;
                return
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

    protected handleInput(message: IMessage) {
        switch (message.type) {
            case GameTwoMessageTypes.MOVE:
                this.movePlayer(message.userId!, message.direction!);
                //this.players.get(message.userId!)!.setDirection(message.direction!);
                break;
            default:
                console.info(message);
        }
    }

}