import { cleanup, queryAllByText, queryByText, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { FinishedScreen } from '../../../components/screen/FinishedScreen';
import { defaultValue, GameContext } from '../../../contexts/GameContextProvider';
import { defaultValue as screenDefaultValue, ScreenSocketContext } from '../../../contexts/ScreenSocketContextProvider';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import theme from '../../../styles/theme';
import { formatMs } from '../../../utils/formatMs';

afterEach(cleanup);
describe('Screen FinishedScreen', () => {
    const socket = new InMemorySocketFake();
    const FinishedScreenComponent = (
        <ThemeProvider theme={theme}>
            <ScreenSocketContext.Provider value={{ ...screenDefaultValue, screenSocket: socket }}>
                <FinishedScreen />
            </ScreenSocketContext.Provider>
        </ThemeProvider>
    );

    it('finished users and their rank are rendered', () => {
        const playerRanks = [
            {
                id: '1',
                rank: 1,
                name: 'User 1',
                totalTimeInMs: 5000,
                finished: true,
                positionX: 0,
                isActive: true,
                dead: false,
            },
            {
                id: '2',
                rank: 2,
                name: 'User 2',
                totalTimeInMs: 5600,
                finished: true,
                positionX: 0,
                isActive: true,
                dead: false,
            },
        ];

        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, playerRanks }}>
                    <FinishedScreen />
                </GameContext.Provider>
            </ThemeProvider>
        );

        playerRanks.forEach(playerRank => {
            if (playerRank.rank) {
                const givenText = `#${playerRank.rank} ${playerRank.name}`;
                expect(queryByText(container, givenText)).toBeTruthy();
                return;
            }

            expect(queryByText(container, `${playerRank.name}`)).toBeTruthy();
        });
    });

    it('users times are formatted and rendered', () => {
        const playerRanks = [
            {
                id: '1',
                rank: 1,
                name: 'User 1',
                totalTimeInMs: 5000,
                finished: true,
                positionX: 0,
                isActive: true,
                dead: false,
            },
            {
                id: '2',
                rank: 2,
                name: 'User 2',
                totalTimeInMs: 5600,
                finished: true,
                positionX: 0,
                isActive: true,
                dead: false,
            },
        ];

        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, playerRanks }}>
                    <FinishedScreen />
                </GameContext.Provider>
            </ThemeProvider>
        );

        playerRanks.forEach(playerRank => {
            const givenText = formatMs(playerRank.totalTimeInMs);
            expect(queryAllByText(container, givenText)).toBeTruthy();
        });
    });

    it('if screen is admin, a button is rendered with the given text', () => {
        const givenText = 'Back to Lobby';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, screenAdmin: true }}>
                    {FinishedScreenComponent}
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('if screen is not admin, no button with given text is rendered', () => {
        const givenText = 'Back to Lobby';

        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, screenAdmin: false }}>
                    {FinishedScreenComponent}
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeFalsy();
    });

    it('if user died show a dead players section', () => {
        const playerRanks = [
            {
                id: '1',
                rank: 1,
                name: 'User 1',
                totalTimeInMs: 5000,
                finished: true,
                positionX: 0,
                isActive: true,
                dead: true,
            },
            {
                id: '2',
                rank: 2,
                name: 'User 2',
                totalTimeInMs: 5600,
                finished: true,
                positionX: 0,
                isActive: true,
                dead: false,
            },
        ];

        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, playerRanks }}>
                    <FinishedScreen />
                </GameContext.Provider>
            </ThemeProvider>
        );
        expect(queryAllByText(container, 'Dead Players')).toBeTruthy();
    });

    it('does not display back to lobby button if player is not admin', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, screenAdmin: false }}>
                    {FinishedScreenComponent}
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(queryByText(container, 'Back to Lobby')).toBeFalsy();
    });

    it('if player is admin the back to lobby button is rendered', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, screenAdmin: true }}>
                    {FinishedScreenComponent}
                </GameContext.Provider>
            </ThemeProvider>
        );
        expect(queryByText(container, 'Back to Lobby')).toBeTruthy();
    });
});
