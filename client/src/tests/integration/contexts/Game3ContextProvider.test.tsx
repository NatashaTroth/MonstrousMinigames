import { queryByText, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import Game3ContextProvider from '../../../contexts/game3/Game3ContextProvider';
import Game3 from '../../../domain/game3/screen/components/Game3';
import theme from '../../../styles/theme';

describe('Game3ContextProvider', () => {
    it('Game3ContextProvider should provide roundIdx state', () => {
        const givenText = 'Round 1';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Game3ContextProvider>
                    <Game3 />
                </Game3ContextProvider>
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
