import '@testing-library/jest-dom/extend-expect';

import { cleanup, queryByText, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import ChooseGame from '../../../components/screen/ChooseGame';
import { games } from '../../../config/games';
import { defaultValue, GameContext } from '../../../contexts/GameContextProvider';
import theme from '../../../styles/theme';

afterEach(cleanup);
describe('Choose Game', () => {
    const ChooseGameScreen = (
        <ThemeProvider theme={theme}>
            <GameContext.Provider value={{ ...defaultValue, screenAdmin: true }}>
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
});
