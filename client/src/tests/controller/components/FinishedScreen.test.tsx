import { cleanup, fireEvent, queryByText, render } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { FinishedScreen } from '../../../components/controller/FinishedScreen';
import {
    ControllerSocketContext,
    defaultValue as controllerDefaultValue,
} from '../../../contexts/ControllerSocketContextProvider';
import { defaultValue as gameContextDefaultValue, GameContext } from '../../../contexts/GameContextProvider';
import { defaultValue, PlayerContext } from '../../../contexts/PlayerContextProvider';
import history from '../../../domain/history/history';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import theme from '../../../styles/theme';

afterEach(cleanup);

describe('Controller FinishedScreen', () => {
    const socket = new InMemorySocketFake();

    const FinishedScreenComponent = (
        <ThemeProvider theme={theme}>
            <ControllerSocketContext.Provider value={{ ...controllerDefaultValue, controllerSocket: socket }}>
                <FinishedScreen />
            </ControllerSocketContext.Provider>
        </ThemeProvider>
    );

    it('user rank is rendered', () => {
        const rank = 1;
        const givenText = `#${rank}`;
        const { container } = render(
            <ThemeProvider theme={theme}>
                <PlayerContext.Provider value={{ ...defaultValue, playerRank: rank }}>
                    {FinishedScreenComponent}
                </PlayerContext.Provider>
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('when connect back to lobby is clicked, resetGame function should be called', () => {
        const onClick = jest.fn();
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <GameContext.Provider value={{ ...gameContextDefaultValue, resetGame: onClick }}>
                        {FinishedScreenComponent}
                    </GameContext.Provider>
                </Router>
            </ThemeProvider>
        );

        const button = container.querySelector('button');

        if (button) {
            fireEvent.click(button);
            expect(onClick).toHaveBeenCalledTimes(1);
        }
    });
});
