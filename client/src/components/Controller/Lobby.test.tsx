import { cleanup, queryByText, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Lobby } from '../../components/Controller/Lobby';
import { defaultValue as defaultGameValue, GameContext } from '../../contexts/GameContextProvider';
import { defaultValue, PlayerContext } from '../../contexts/PlayerContextProvider';
import theme from '../../theme';

afterEach(cleanup);

describe('PlayerContextProvider', () => {
    it('when data is loading, no instructions are rendered', () => {
        const givenText = 'Wait for Player #1 to start your game!';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue }}>
                    <PlayerContext.Provider value={{ ...defaultValue }}>
                        <Lobby />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );
        expect(queryByText(container, givenText)).toBeFalsy();
    });
});
