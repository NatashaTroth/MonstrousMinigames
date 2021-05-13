import { MessageTypes } from '../../../utils/constants';
import { PlayerFinishedMessage } from '../../typeGuards/playerFinished';
import { handlePlayerFinishedMessage } from './handlePlayerFinishedMessage';

describe('playerHasFinished function', () => {
    let setPlayerFinished: jest.Mock<any, any>;
    let setPlayerRank: jest.Mock<any, any>;

    const mockData: PlayerFinishedMessage = {
        type: MessageTypes.playerFinished,
        rank: 1,
    };

    beforeEach(() => {
        setPlayerFinished = jest.fn();
        setPlayerRank = jest.fn();
    });

    it('handed setPlayerFinished should be called with true', () => {
        const playerFinished = false;
        handlePlayerFinishedMessage({
            data: mockData,
            playerFinished,
            dependencies: { setPlayerFinished, setPlayerRank },
        });

        expect(setPlayerFinished).toHaveBeenLastCalledWith(true);
    });

    it('handed setPlayerRank should be called with passed rank', () => {
        const playerFinished = false;
        handlePlayerFinishedMessage({
            data: mockData,
            playerFinished,
            dependencies: { setPlayerFinished, setPlayerRank },
        });

        expect(setPlayerRank).toHaveBeenLastCalledWith(mockData.rank);
    });

    it('if player has already finished, setPlayerFinished should not be called', () => {
        const playerFinished = true;
        handlePlayerFinishedMessage({
            data: mockData,
            playerFinished,
            dependencies: { setPlayerFinished, setPlayerRank },
        });

        expect(setPlayerFinished).toHaveBeenCalledTimes(0);
    });

    it('if player has already finished, setPlayerRank should not be called', () => {
        const playerFinished = true;
        handlePlayerFinishedMessage({
            data: mockData,
            playerFinished,
            dependencies: { setPlayerFinished, setPlayerRank },
        });

        expect(setPlayerRank).toHaveBeenCalledTimes(0);
    });
});
