// eslint-disable-next-line simple-import-sort/imports
import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';

import { canStartGame } from '../../../components/screen/PlayersGetReady';
import { GameNames } from '../../../config/games';

afterEach(cleanup);

describe('canStartGame', () => {
    it('should return false for canStart, when no users and no chosen game are given', () => {
        const result = canStartGame(true, false, undefined, undefined);

        expect(result).toEqual(expect.objectContaining({ canStart: false }));
    });

    it('should return true for canStart, when all players ready and chosen game is one', () => {
        const result = canStartGame(false, true, [], GameNames.game1);

        expect(result).toEqual(expect.objectContaining({ canStart: true }));
    });

    it('should return false for canStart, when chosen game is 3 and connected users are less than 3', () => {
        const result = canStartGame(false, true, [], GameNames.game3);

        expect(result).toEqual(expect.objectContaining({ canStart: false }));
    });

    it('should return true for canStart, when chosen game is 3 and connected users are 3', () => {
        const roomId = 'AKES';
        const result = canStartGame(
            false,
            true,
            [
                { id: '1', name: 'test', roomId, number: 1, ready: true },
                { id: '1', name: 'test', roomId, number: 1, ready: true },
                { id: '1', name: 'test', roomId, number: 1, ready: true },
            ],
            GameNames.game3
        );

        expect(result).toEqual(expect.objectContaining({ canStart: true }));
    });
});
