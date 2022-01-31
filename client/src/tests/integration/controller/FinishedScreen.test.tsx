import { cleanup, fireEvent, render } from "@testing-library/react";
import React from "react";
import { Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { FinishedScreen } from "../../../components/controller/FinishedScreen";
import {
    ControllerSocketContext, defaultValue as controllerDefaultValue
} from "../../../contexts/controller/ControllerSocketContextProvider";
import {
    defaultValue as gameContextDefaultValue, GameContext
} from "../../../contexts/GameContextProvider";
import history from "../../../domain/history/history";
import { FakeInMemorySocket } from "../../../domain/socket/InMemorySocketFake";
import theme from "../../../styles/theme";

afterEach(cleanup);

describe('Controller FinishedScreen', () => {
    const socket = new FakeInMemorySocket();

    const FinishedScreenComponent = (
        <ThemeProvider theme={theme}>
            <ControllerSocketContext.Provider value={{ ...controllerDefaultValue, controllerSocket: socket }}>
                <FinishedScreen />
            </ControllerSocketContext.Provider>
        </ThemeProvider>
    );

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
