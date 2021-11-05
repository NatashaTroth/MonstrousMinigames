/* istanbul ignore file */
import User from '../../src/classes/user';
import { GameState } from '../../src/gameplay/enums';
import Game from '../../src/gameplay/Game';
import { IGameStateBase } from '../../src/gameplay/interfaces/IGameStateBase';
import Leaderboard from '../../src/gameplay/leaderboard/Leaderboard';
import Player from '../../src/gameplay/Player';
import { IMessage } from '../../src/interfaces/messages';

export class MockPlayer extends Player {
    constructor(id: string, name: string, characterNumber: number) {
        super(id, name, characterNumber);
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        // do something
    }
}

export interface MockGameStateInfo extends IGameStateBase {
    roomId: string;
    gameState: GameState;
}

export class MockGameClass extends Game<MockPlayer, MockGameStateInfo> {
    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);
    }
    beforeCreateNewGame(): void {
        //mock
    }
    mapUserToPlayer(user: User): MockPlayer {
        //mock
        return new MockPlayer(user.id, user.name, user.characterNumber);
    }
    update(timeElapsed: number, timeElapsedSinceLastFrame: number): Promise<void> | void {
        //mock
    }
    handleInput(message: IMessage): Promise<void> | void {
        //mock
    }
    postProcessPlayers(playersIterable: IterableIterator<MockPlayer>): void {
        //mock
    }
    getGameStateInfo(): MockGameStateInfo {
        //mock
        return { roomId: 'xx', gameState: GameState.Initialised };
    }
}
