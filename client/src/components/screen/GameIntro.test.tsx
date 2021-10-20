import "jest-styled-components";
import { MuiThemeProvider } from "@material-ui/core";
import { cleanup, queryByText, render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import { GameNames } from "../../config/games";
import { ScreenStates } from "../../config/screenStates";
import { defaultValue, GameContext } from "../../contexts/GameContextProvider";
import {
    defaultValue as screenSocketProviderDefaultValue, ScreenSocketContext
} from "../../contexts/ScreenSocketContextProvider";
import { InMemorySocketFake } from "../../domain/socket/InMemorySocketFake";
import theme from "../../styles/theme";
import { MessageTypes } from "../../utils/constants";
import GameIntro from "../screen/GameIntro";

afterEach(cleanup);

describe('GameWrapper', () => {
    xit('if chosen game is game1, given text is rendered', () => {
        const givenText =
            'Your goal is to be the first player to reach safety in the cave while conquering obstacles along the way!';
        const { container } = render(
            <MuiThemeProvider theme={theme}>
                <ThemeProvider theme={theme}>
                    <GameContext.Provider value={{ ...defaultValue, chosenGame: GameNames.game1 }}>
                        <GameIntro />
                    </GameContext.Provider>
                </ThemeProvider>
            </MuiThemeProvider>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('if screen is admin, the screen state is emitted', () => {
        const screenSocket = new InMemorySocketFake();

        render(
            <MuiThemeProvider theme={theme}>
                <ThemeProvider theme={theme}>
                    <ScreenSocketContext.Provider value={{ ...screenSocketProviderDefaultValue, screenSocket }}>
                        <GameContext.Provider value={{ ...defaultValue, screenAdmin: true }}>
                            <GameIntro />
                        </GameContext.Provider>
                    </ScreenSocketContext.Provider>
                </ThemeProvider>
            </MuiThemeProvider>
        );

        expect(screenSocket.emitedVals).toEqual([{ type: MessageTypes.screenState, state: ScreenStates.gameIntro }]);
    });
});
