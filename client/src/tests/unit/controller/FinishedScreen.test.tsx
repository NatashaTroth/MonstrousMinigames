import { cleanup, queryByText, render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import { FinishedScreen } from "../../../components/controller/FinishedScreen";
import {
    ControllerSocketContext, defaultValue as controllerDefaultValue
} from "../../../contexts/controller/ControllerSocketContextProvider";
import { defaultValue, PlayerContext } from "../../../contexts/PlayerContextProvider";
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
});
