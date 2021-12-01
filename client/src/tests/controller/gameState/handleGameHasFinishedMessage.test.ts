import { createMemoryHistory } from 'history';

import { handleGameHasFinishedMessage } from '../../../domain/commonGameState/controller/handleGameHasFinishedMessage';
import { controllerFinishedRoute } from '../../../utils/routes';

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('handleGameHasFinishedMessage', () => {
    const roomId = '1234';
    const playerRank = 1;
    const playerRanks = [
        {
            id: '1',
            name: 'Test',
            rank: 1,
            finished: true,
            totalTimeInMs: 123,
            positionX: 0,
            isActive: true,
            dead: false,
        },
    ];

    it('history should change to given route', () => {
        const history = createMemoryHistory();
        const setPlayerRank = jest.fn();

        const withDependencies = handleGameHasFinishedMessage({
            playerRank,
            setPlayerRank,
            history,
        });
        withDependencies({ roomId, playerRanks });

        expect(history.location).toHaveProperty('pathname', controllerFinishedRoute(roomId));
    });

    it('handed setPlayerRank function should be called', () => {
        const setPlayerRank = jest.fn();
        const history = createMemoryHistory();
        global.sessionStorage.setItem('userId', '1');

        const withDependencies = handleGameHasFinishedMessage({
            playerRank: undefined,
            setPlayerRank,
            history,
        });

        withDependencies({
            roomId,
            playerRanks,
        });

        expect(setPlayerRank).toHaveBeenCalledTimes(1);
    });

    it('handed setPlayerRank function should not be called', () => {
        const setPlayerRank = jest.fn();
        const history = createMemoryHistory();
        global.sessionStorage.setItem('userId', '1');

        const playerRanks = [
            {
                id: '1',
                name: 'Test',
                rank: undefined,
                finished: true,
                totalTimeInMs: 123,
                positionX: 0,
                isActive: true,
                dead: false,
            },
        ];

        const withDependencies = handleGameHasFinishedMessage({
            playerRank: undefined,
            setPlayerRank,
            history,
        });

        withDependencies({
            roomId,
            playerRanks,
        });

        expect(setPlayerRank).toHaveBeenCalledTimes(0);
    });

    it('stomeTimeoutId should be remove from sessionStorage', () => {
        const setPlayerRank = jest.fn();
        const history = createMemoryHistory();
        global.sessionStorage.setItem('windmillTimeoutId', '1');

        const withDependencies = handleGameHasFinishedMessage({
            playerRank: undefined,
            setPlayerRank,
            history,
        });

        withDependencies({
            roomId,
            playerRanks,
        });

        expect(global.sessionStorage.getItem('windmillTimeoutId')).toBe(null);
    });
});
