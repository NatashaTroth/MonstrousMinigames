import { cleanup, queryAllByText, queryByText, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { defaultValue, GameContext } from '../../../contexts/GameContextProvider';
import { defaultValue as screenDefaultValue, ScreenSocketContext } from '../../../contexts/ScreenSocketContextProvider';
import theme from '../../../styles/theme';
import { formatMs } from '../../../utils/formatMs';
import { InMemorySocketFake } from '../../socket/InMemorySocketFake';
import PlayersGetReady from './PlayersGetReady';

afterEach(cleanup);
describe('Screen FinishedScreen', () => {
    const connectedUsers = [
        {
            roomId: "test", 
            id: "testuser",
            name: "Max Mustermann",
            number: 1, 
            characterNumber: 1, 
            active: true, 
            ready: true
        },
        {
            roomId: "test", 
            id: "testuser2",
            name: "Maria Musterfrau",
            number: 2, 
            characterNumber: 2, 
            active: true, 
            ready: false
        },
    ];

    const socket = new InMemorySocketFake();
    const ReadyScreenComponent = (
        <ThemeProvider theme={theme}>
            <GameContext.Provider value={{ ...defaultValue, connectedUsers: connectedUsers }}>
                <PlayersGetReady />
            </GameContext.Provider>
        </ThemeProvider>
    );

    it('renders player numbers', () => {
        const player1 = 'Player 1';
        const player2 = 'Player 2';
        const player3 = 'Player 3';
        const player4 = 'Player 4';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <PlayersGetReady />
            </ThemeProvider>
        );
        expect(queryByText(container, player1)).toBeTruthy();
        expect(queryByText(container, player2)).toBeTruthy();
        expect(queryByText(container, player3)).toBeTruthy();
        expect(queryByText(container, player4)).toBeTruthy();
    });

    it('renders "lets join" for each open spot', () => {
        const { container } = render(
            ReadyScreenComponent
        );
        expect(queryAllByText(container, "Let's join")).toBeTruthy();
        expect(queryAllByText(container, "Let's join").length).toEqual(2); // connectedUsers includes 2 players, so 2 spots should still be open
    });

     it('renders "ready" if players are ready', () => {
        const { container } = render(
            ReadyScreenComponent
        );
        expect(queryByText(container, "Ready")).toBeTruthy();
        expect(queryByText(container, "Not Ready")).toBeTruthy();
    });

    it('renders player names', () => {
        const { container } = render(
            ReadyScreenComponent
        );
        expect(queryByText(container, "Max Mustermann")).toBeTruthy();
        expect(queryByText(container, "Maria Musterfrau")).toBeTruthy();
    });
});
