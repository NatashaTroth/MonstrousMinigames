import 'reflect-metadata';

import { GameState } from '../../../../src/gameplay/enums';
import {
    GameThreeMessageTypes
} from '../../../../src/gameplay/gameThree/enums/GameThreeMessageTypes';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { leaderboard, roomId } from '../../mockData';

let gameThree: GameThree;

describe('Handle Input Method', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.gameState = GameState.Started;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call the handleReceivedPhoto method when the Message is of type PHOTO', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleReceivedPhoto').mockImplementation(() => {
            Promise.resolve();
        });
        const message = { type: GameThreeMessageTypes.PHOTO };
        gameThree['handleInput'](message);
        expect(spy).toBeCalledTimes(1);
    });

    it('should call the handleReceivedPhotoVote method when the Message is of type PHOTO_VOTE', async () => {
        const spy = jest.spyOn(GameThree.prototype as any, 'handleReceivedPhotoVote').mockImplementation(() => {
            Promise.resolve();
        });
        const message = { type: GameThreeMessageTypes.PHOTO_VOTE };
        gameThree['handleInput'](message);
        expect(spy).toBeCalledTimes(1);
    });

    it('should output the message to the console if none of the above message types', async () => {
        console.info = jest.fn();
        gameThree['handleInput']({ type: 'WRONG' });
        expect(console.info).toHaveBeenCalledTimes(1);
    });
});
