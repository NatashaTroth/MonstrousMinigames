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


export default class GameTwo extends Game {
    lengthX = InitialParameters.LENGTH_X;
    lengthY = InitialParameters.LENGTH_Y;

    initialPlayerPositions = InitialParameters.PLAYERS_POSITIONS;

    getGameStateInfo(): IGameStateBase {
        throw new Error('Method not implemented.');
    }
    protected mapUserToPlayer(user: User): Player {
        const player = new GameTwoPlayer(user.id, user.name, this.initialPlayerPositions[user.number].x, this.initialPlayerPositions[user.number].y, user.characterNumber);
        console.info(player);
        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        throw new Error('Method not implemented.');
    }
    protected handleInput(message: IMessage): void | Promise<void> {
        throw new Error('Method not implemented.');
    }
    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        throw new Error('Method not implemented.');
    }

    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);
        console.log('game2 created')
    }
}