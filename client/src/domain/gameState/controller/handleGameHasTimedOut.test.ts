import { GameState, MessageTypes } from '../../../utils/constants';
import { TimedOutMessage } from '../../typeGuards/timedOut';
import { handleGameHasTimedOutMessage } from './handleGameHasTimedOutMessage';

describe('gameHasTimedOut function', () => {
    const setPlayerFinished = jest.fn();
    const setPlayerRank = jest.fn();
    const roomId = '123';

    const mockData: TimedOutMessage = {
        type: MessageTypes.gameHasTimedOut,
        rank: 1,
        data: {
            gameState: GameState.finished,
            numberOfObstacles: 4,
            roomId,
            trackLength: 400,
            playerRanks: [],
            playersState: [],
        },
    };

    it('handed setPlayerFinished should be called with true', () => {
        handleGameHasTimedOutMessage({ data: mockData, dependencies: { setPlayerFinished, setPlayerRank } });

        expect(setPlayerFinished).toHaveBeenLastCalledWith(true);
    });

    it('handed setPlayerRank should be called with handed playerRank', () => {
        handleGameHasTimedOutMessage({ data: mockData, dependencies: { setPlayerFinished, setPlayerRank } });

        expect(setPlayerRank).toHaveBeenLastCalledWith(mockData.rank);
    });
});
