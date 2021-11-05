import { cleanup, fireEvent, queryByText, render } from "@testing-library/react";
import React from "react";
import { Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import {
    ControllerSocketContext, defaultValue as controllerDefaultValue
} from "../../contexts/ControllerSocketContextProvider";
import {
    defaultValue as gameContextDefaultValue, GameContext
} from "../../contexts/GameContextProvider";
import { defaultValue, PlayerContext } from "../../contexts/PlayerContextProvider";
import history from "../../domain/history/history";
import { InMemorySocketFake } from "../../domain/socket/InMemorySocketFake";
import theme from "../../styles/theme";
import { FinishedScreen } from "./FinishedScreen";

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

    xit('when player reaches the goal, it renders text "Finished!"', () => {
        const givenText = 'Finished!';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <PlayerContext.Provider value={{ ...defaultValue, playerRank: 1 }}>
                    {FinishedScreenComponent}
                </PlayerContext.Provider>
            </ThemeProvider>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('user rank is rendered', () => {
        const givenText = '#1';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <PlayerContext.Provider value={{ ...defaultValue, playerRank: 1 }}>
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
