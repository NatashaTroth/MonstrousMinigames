import { createMemoryHistory } from 'history';

import { controllerFinishedRoute } from '../../../utils/routes';
import { handleGameHasFinishedMessage } from './handleGameHasFinishedMessage';

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

        handleGameHasFinishedMessage({ roomId, playerRank, playerRanks, dependencies: { setPlayerRank }, history });

        expect(history.location).toHaveProperty('pathname', controllerFinishedRoute(roomId));
    });

    it('handed setPlayerRank function should be called', () => {
        const setPlayerRank = jest.fn();
        const history = createMemoryHistory();
        global.sessionStorage.setItem('userId', '1');

        handleGameHasFinishedMessage({
            roomId,
            playerRank: undefined,
            playerRanks,
            dependencies: { setPlayerRank },
            history,
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

        handleGameHasFinishedMessage({
            roomId,
            playerRank: undefined,
            playerRanks,
            dependencies: { setPlayerRank },
            history,
        });

        expect(setPlayerRank).toHaveBeenCalledTimes(0);
    });

    it('stomeTimeoutId should be remove from sessionStorage', () => {
        const setPlayerRank = jest.fn();
        const history = createMemoryHistory();
        global.sessionStorage.setItem('windmillTimeoutId', '1');

        handleGameHasFinishedMessage({
            roomId,
            playerRank: undefined,
            playerRanks,
            dependencies: { setPlayerRank },
            history,
        });

        expect(global.sessionStorage.getItem('windmillTimeoutId')).toBe(null);
    });
});
