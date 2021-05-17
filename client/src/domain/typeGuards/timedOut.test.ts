import { GameState, MessageTypes } from '../../utils/constants';
import { TimedOutMessage, timedOutTypeGuard } from './timedOut';

describe('timedOut TypeGuard', () => {
    it('when type is timedOut, it should return true', () => {
        const data: TimedOutMessage = {
            type: MessageTypes.gameHasTimedOut,
            rank: 1,
            data: {
                gameState: GameState.finished,
                numberOfObstacles: 4,
                roomId: '1234',
                trackLength: 400,
                playerRanks: [],
                playersState: [],
            },
        };

        expect(timedOutTypeGuard(data)).toEqual(true);
    });
});
