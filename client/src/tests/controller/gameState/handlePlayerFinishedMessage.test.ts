import {
    handlePlayerFinishedMessage
} from "../../../domain/commonGameState/controller/handlePlayerFinishedMessage";
import { PlayerFinishedMessage } from "../../../domain/typeGuards/game1/playerFinished";
import { MessageTypesGame1 } from "../../../utils/constants";

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

        const withDependencies = handlePlayerFinishedMessage({
            setPlayerFinished,
            setPlayerRank,
        });

        withDependencies({ data: mockData, roomId, playerFinished });

        expect(setPlayerFinished).toHaveBeenLastCalledWith(true);
    });

    it('handed setPlayerRank should be called with passed rank', () => {
        const playerFinished = false;
        const withDependencies = handlePlayerFinishedMessage({
            setPlayerFinished,
            setPlayerRank,
        });

        withDependencies({ data: mockData, roomId, playerFinished });

        expect(setPlayerRank).toHaveBeenLastCalledWith(mockData.rank);
    });

    it('if player has already finished, setPlayerFinished should not be called', () => {
        const playerFinished = true;
        const withDependencies = handlePlayerFinishedMessage({
            setPlayerFinished,
            setPlayerRank,
        });

        withDependencies({ data: mockData, roomId, playerFinished });

        expect(setPlayerFinished).toHaveBeenCalledTimes(0);
    });

    it('if player has already finished, setPlayerRank should not be called', () => {
        const playerFinished = true;
        const withDependencies = handlePlayerFinishedMessage({
            setPlayerFinished,
            setPlayerRank,
        });

        withDependencies({ data: mockData, roomId, playerFinished });

        expect(setPlayerRank).toHaveBeenCalledTimes(0);
    });

    it('stomeTimeoutId should be remove from sessionStorage', () => {
        const setPlayerRank = jest.fn();
        const setPlayerFinished = jest.fn();

        const playerFinished = false;
        global.sessionStorage.setItem('windmillTimeoutId', '1');

        const withDependencies = handlePlayerFinishedMessage({
            setPlayerFinished,
            setPlayerRank,
        });

        withDependencies({ data: mockData, roomId, playerFinished });

        expect(global.sessionStorage.getItem('windmillTimeoutId')).toBe(null);
    });
});
