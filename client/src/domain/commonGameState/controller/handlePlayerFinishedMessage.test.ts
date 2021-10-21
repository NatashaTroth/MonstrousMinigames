import { MessageTypesGame1 } from "../../../utils/constants";
import { PlayerFinishedMessage } from "../../typeGuards/game1/playerFinished";
import { handlePlayerFinishedMessage } from "./handlePlayerFinishedMessage";

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('playerHasFinished function', () => {
    let setPlayerFinished: jest.Mock<any, any>;
    let setPlayerRank: jest.Mock<any, any>;
    const roomId = 'ABCDE';

    const mockData: PlayerFinishedMessage = {
        type: MessageTypesGame1.playerFinished,
        rank: 1,
        userId: '1',
    };

    beforeEach(() => {
        setPlayerFinished = jest.fn();
        setPlayerRank = jest.fn();
    });

    it('handed setPlayerFinished should be called with true', () => {
        const playerFinished = false;
        handlePlayerFinishedMessage({
            data: mockData,
            roomId,
            playerFinished,
            dependencies: { setPlayerFinished, setPlayerRank },
        });

        expect(setPlayerFinished).toHaveBeenLastCalledWith(true);
    });

    it('handed setPlayerRank should be called with passed rank', () => {
        const playerFinished = false;
        handlePlayerFinishedMessage({
            data: mockData,
            roomId,
            playerFinished,
            dependencies: { setPlayerFinished, setPlayerRank },
        });

        expect(setPlayerRank).toHaveBeenLastCalledWith(mockData.rank);
    });

    it('if player has already finished, setPlayerFinished should not be called', () => {
        const playerFinished = true;
        handlePlayerFinishedMessage({
            data: mockData,
            roomId,
            playerFinished,
            dependencies: { setPlayerFinished, setPlayerRank },
        });

        expect(setPlayerFinished).toHaveBeenCalledTimes(0);
    });

    it('if player has already finished, setPlayerRank should not be called', () => {
        const playerFinished = true;
        handlePlayerFinishedMessage({
            data: mockData,
            roomId,
            playerFinished,
            dependencies: { setPlayerFinished, setPlayerRank },
        });

        expect(setPlayerRank).toHaveBeenCalledTimes(0);
    });

    it('stomeTimeoutId should be remove from sessionStorage', () => {
        const setPlayerRank = jest.fn();
        const setPlayerFinished = jest.fn();

        const playerFinished = false;
        global.sessionStorage.setItem('windmillTimeoutId', '1');

        handlePlayerFinishedMessage({
            data: mockData,
            roomId,
            playerFinished,
            dependencies: { setPlayerRank, setPlayerFinished },
        });

        expect(global.sessionStorage.getItem('windmillTimeoutId')).toBe(null);
    });
});
