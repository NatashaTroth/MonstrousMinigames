import '@testing-library/jest-dom/extend-expect';

import { cleanup, fireEvent, queryByText, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { games } from '../../config/games';
import { defaultValue, GameContext } from '../../contexts/GameContextProvider';
import theme from '../../styles/theme';
import ChooseGame from './ChooseGame';

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

    const ChooseGameScreen = (
        <ThemeProvider theme={theme}>
            <GameContext.Provider value={{ ...defaultValue, connectedUsers: connectedUsers, screenAdmin: true }}>
                <ChooseGame />
            </GameContext.Provider>
        </ThemeProvider>
    );

    it('renders game names', () => {
        const { container } = render(ChooseGameScreen);
        const gameNames = games.map(game => game.name);
        gameNames.forEach(name => {
            expect(queryByText(container, name)).toBeTruthy();
        });
    });

    it('renders button to start selected game', () => {
        const { container } = render(ChooseGameScreen);
        const button = container.querySelector('button');
        expect(button).not.toBeDisabled();
        const onclick = jest.fn();
        if (button) {
            button.onclick = onclick;
            fireEvent.click(button);
            expect(onclick).toHaveBeenCalledTimes(1);
        }
    });
});
