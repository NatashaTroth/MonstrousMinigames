import User from '../../classes/user';
import { IMessage } from '../../interfaces/messages';
import { GameStateInfo } from '../catchFood/interfaces';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import { IGameStateBase } from '../interfaces/IGameStateBase';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import GameTwoPlayer from './GameTwoPlayer';
import InitialParameters from './constants/InitialParameters'
import Sheep from './classes/Sheep';
import random from 'random';



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


export default class GameTwo extends Game<GameTwoPlayer> {
    public lengthX: number;
    public lengthY: number;
    public sheep: Sheep[];

    initialPlayerPositions = InitialParameters.PLAYERS_POSITIONS;

    getGameStateInfo(): IGameStateBase {
        throw new Error('Method not implemented.');
    }
    protected mapUserToPlayer(user: User): GameTwoPlayer {
        const player = new GameTwoPlayer(user.id, user.name, this.initialPlayerPositions[user.number].x, this.initialPlayerPositions[user.number].y, user.characterNumber);
        console.info(player);
        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        console.error('Method not implemented.');
    }
    protected handleInput(message: IMessage): void | Promise<void> {
        console.error('Method not implemented.');
    }
    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        console.error('Method not implemented.');
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
}