// eslint-disable-next-line simple-import-sort/imports
import '@testing-library/jest-dom/extend-expect';
import { cleanup, queryAllByText, queryByText, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import PlayersGetReady from '../../../components/screen/PlayersGetReady';
import { defaultValue, GameContext } from '../../../contexts/GameContextProvider';
import theme from '../../../styles/theme';

afterEach(cleanup);
describe('Screen PlayersGetReady', () => {
    const roomId = 'ACES';
    const connectedUsers = [
        {
            roomId,
            id: 'testuser',
            name: 'Max',
            number: 1,
            characterNumber: 1,
            active: true,
            ready: true,
        },
        {
            roomId,
            id: 'testuser2',
            name: 'Maria',
            number: 2,
            characterNumber: 2,
            active: true,
            ready: false,
        },
        {
            roomId,
            id: 'testuser3',
            name: 'Mock',
            number: 3,
            characterNumber: 3,
            active: true,
            ready: false,
        },
    ];

    it('renders connectedUsers', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, connectedUsers, screenAdmin: true, roomId }}>
                    <PlayersGetReady />
                </GameContext.Provider>
            </ThemeProvider>
        );
        connectedUsers.forEach(user => {
            expect(queryByText(container, user.name)).toBeTruthy();
        });
    });

    it('renders "lets join" for each open spot', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, connectedUsers, screenAdmin: true, roomId }}>
                    <PlayersGetReady />
                </GameContext.Provider>
            </ThemeProvider>
        );
        expect(queryAllByText(container, "Let's join")).toHaveLength(4 - connectedUsers.length);
    });

    it('renders "ready" for players who are ready', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, connectedUsers, screenAdmin: true, roomId }}>
                    <PlayersGetReady />
                </GameContext.Provider>
            </ThemeProvider>
        );
        const readyUsers = connectedUsers.filter(user => user.ready);

        expect(queryAllByText(container, 'Ready')).toHaveLength(readyUsers.length);
    });

    it('renders "not ready" for players who are not ready', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, connectedUsers, screenAdmin: true, roomId }}>
                    <PlayersGetReady />
                </GameContext.Provider>
            </ThemeProvider>
        );
        const notReadyUsers = connectedUsers.filter(user => !user.ready);

        expect(queryAllByText(container, 'Not Ready')).toHaveLength(notReadyUsers.length);
    });

    it('if player is admin, a start button is rendered', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, screenAdmin: true, roomId }}>
                    <PlayersGetReady />
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(queryByText(container, 'Start')).toBeTruthy();
    });

    it('if not all players are ready, the start button is disabled', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, connectedUsers, screenAdmin: true, roomId }}>
                    <PlayersGetReady />
                </GameContext.Provider>
            </ThemeProvider>
        );

        const button = container.querySelector('button');
        expect(button).toBeDisabled();
    });
});
