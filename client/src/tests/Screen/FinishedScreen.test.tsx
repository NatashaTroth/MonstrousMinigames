import { cleanup, queryAllByText, queryByText, render } from '@testing-library/react';
import React from 'react';

import { FinishedScreen } from '../../components/Screen/FinishedScreen';
import { defaultValue, GameContext } from '../../contexts/GameContextProvider';
import { formatMs } from '../../utils/formatMs';

afterEach(cleanup);
describe('Controller FinishedScreen', () => {
    it('renders text "Finished!"', () => {
        const givenText = 'Finished!';
        const { container } = render(<FinishedScreen />);
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('finished users and their rank are rendered', () => {
        const playerRanks = [
            {
                id: 1,
                rank: 1,
                name: 'User 1',
                totalTimeInMs: 5000,
                finished: true,
                positionX: 0,
            },
            {
                id: 2,
                rank: 2,
                name: 'User 2',
                totalTimeInMs: 5600,
                finished: true,
                positionX: 0,
            },
        ];

        const { container } = render(
            <GameContext.Provider value={{ ...defaultValue, playerRanks }}>
                <FinishedScreen />
            </GameContext.Provider>
        );

        playerRanks.forEach(playerRank => {
            if (playerRank.rank) {
                const givenText = `#${playerRank.rank} ${playerRank.name}`;
                expect(queryByText(container, givenText)).toBeTruthy();
            } else {
                expect(queryByText(container, `${playerRank.name}`)).toBeTruthy();
            }
        });
    });

    it('users times are formatted and rendered', () => {
        const playerRanks = [
            {
                id: 1,
                rank: 1,
                name: 'User 1',
                totalTimeInMs: 5000,
                finished: true,
                positionX: 0,
            },
            {
                id: 2,
                rank: 2,
                name: 'User 2',
                totalTimeInMs: 5600,
                finished: true,
                positionX: 0,
            },
        ];

        const { container } = render(
            <GameContext.Provider value={{ ...defaultValue, playerRanks }}>
                <FinishedScreen />
            </GameContext.Provider>
        );

        playerRanks.forEach(playerRank => {
            const givenText = formatMs(playerRank.totalTimeInMs);
            expect(queryAllByText(container, givenText)).toBeTruthy();
        });
    });

    it('if game has timed out, a section for unfinished users is rendered', () => {
        const playerRanks = [
            {
                id: 1,
                rank: 1,
                name: 'User 1',
                totalTimeInMs: 5000,
                finished: true,
                positionX: 0,
            },
            {
                id: 2,
                rank: 2,
                name: 'User 2',
                totalTimeInMs: 5600,
                finished: true,
                positionX: 0,
            },
            {
                id: 3,
                rank: undefined,
                name: 'User 3',
                totalTimeInMs: undefined,
                finished: false,
                positionX: 0,
            },
        ];

        const { container } = render(
            <GameContext.Provider value={{ ...defaultValue, playerRanks, hasTimedOut: true }}>
                <FinishedScreen />
            </GameContext.Provider>
        );

        const givenText = 'Game has timed out!';
        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
