import '@testing-library/jest-dom/extend-expect';

import { cleanup, fireEvent, queryAllByText, queryByText, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { defaultValue, GameContext } from '../../../contexts/GameContextProvider';
import theme from '../../../styles/theme';
import PlayersGetReady from './PlayersGetReady';

afterEach(cleanup);
describe('Screen GetReady', () => {
    const connectedUsers = [
        {
            roomId: 'test',
            id: 'testuser',
            name: 'Max Mustermann',
            number: 1,
            characterNumber: 1,
            active: true,
            ready: true,
        },
        {
            roomId: 'test',
            id: 'testuser2',
            name: 'Maria Musterfrau',
            number: 2,
            characterNumber: 2,
            active: true,
            ready: false,
        },
    ];

    const ReadyScreenComponent = (
        <ThemeProvider theme={theme}>
            <GameContext.Provider value={{ ...defaultValue, connectedUsers: connectedUsers, screenAdmin: true }}>
                <PlayersGetReady />
            </GameContext.Provider>
        </ThemeProvider>
    );

    it('renders player numbers', () => {
        const players = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
        const { container } = render(
            <ThemeProvider theme={theme}>
                <PlayersGetReady />
            </ThemeProvider>
        );
        players.forEach(player => {
            expect(queryByText(container, player)).toBeTruthy();
        });
    });
    it('renders "lets join" for each open spot', () => {
        const { container } = render(ReadyScreenComponent);
        expect(queryAllByText(container, "Let's join")).toBeTruthy();
        expect(queryAllByText(container, "Let's join").length).toEqual(2); // connectedUsers includes 2 players, so 2 spots should still be open
    });

    it('renders "ready" if players are ready', () => {
        const { container } = render(ReadyScreenComponent);
        expect(queryByText(container, 'Ready')).toBeTruthy();
        expect(queryByText(container, 'Not Ready')).toBeTruthy();
    });

    it('renders player names', () => {
        const { container } = render(ReadyScreenComponent);
        expect(queryByText(container, 'Max Mustermann')).toBeTruthy();
        expect(queryByText(container, 'Maria Musterfrau')).toBeTruthy();
    });

    it('if player is admin renders the start button', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, screenAdmin: true }}>
                    <PlayersGetReady />
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(queryByText(container, 'Start')).toBeTruthy();
    });

    it('if not all player are ready the start button is disabled', () => {
        const { container } = render(ReadyScreenComponent);

        const button = container.querySelector('button');
        expect(button).toBeDisabled();
    });

    it('if start button is clicked the onclick method is called', () => {
        const readyUsers = [
            {
                roomId: 'test',
                id: 'testuser',
                name: 'Max Mustermann',
                number: 1,
                characterNumber: 1,
                active: true,
                ready: true,
            },
            {
                roomId: 'test',
                id: 'testuser2',
                name: 'Maria Musterfrau',
                number: 2,
                characterNumber: 2,
                active: true,
                ready: true,
            },
        ];
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, connectedUsers: readyUsers, screenAdmin: true }}>
                    <PlayersGetReady />
                </GameContext.Provider>
            </ThemeProvider>
        );

        const button = container.querySelector('button');
        expect(button).not.toBeDisabled();
        const onclick = jest.fn();
        if (button) {
            button.onclick = onclick;
            fireEvent.click(button);
            expect(onclick).toHaveBeenCalled();
        }
    });
});
