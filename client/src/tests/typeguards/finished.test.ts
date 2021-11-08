import { GameState, MessageTypes } from '../../utils/constants';
import { finishedTypeGuard, GameHasFinishedMessage } from './finished';

describe('finished TypeGuard', () => {
    it('when type is gameHasFinished, it should return true', () => {
        const data: GameHasFinishedMessage = {
            type: MessageTypes.gameHasFinished,
            data: {
                gameState: GameState.finished,
                numberOfObstacles: 4,
                roomId: '1234',
                trackLength: 400,
                playerRanks: [],
                playersState: [],
            },
        };

        expect(finishedTypeGuard(data)).toEqual(true);
    });
});
