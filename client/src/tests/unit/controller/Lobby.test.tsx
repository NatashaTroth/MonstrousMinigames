/* eslint-disable simple-import-sort/imports */
import "jest-styled-components";
import { CircularProgress } from "@material-ui/core";
import { cleanup } from "@testing-library/react";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { configure, mount, shallow } from "enzyme";
import React from "react";
import { ThemeProvider } from "styled-components";

import { Lobby } from "../../../components/controller/Lobby";
import { ReadyButton } from "../../../components/controller/Lobby.sc";
import { characters } from "../../../config/characters";
import { GameNames } from "../../../config/games";
import {
    defaultValue as defaultGameValue, GameContext
} from "../../../contexts/GameContextProvider";
import { defaultValue, PlayerContext } from "../../../contexts/PlayerContextProvider";
import history from "../../../domain/history/history";
import theme from "../../../styles/theme";

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Lobby', () => {
    it('when data is loading, a CircularProgress is rendered', () => {
        const container = shallow(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue, chosenGame: GameNames.game1 }}>
                    <PlayerContext.Provider value={{ ...defaultValue }}>
                        <Lobby history={history} />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );
        expect(container.find(CircularProgress)).toBeTruthy();
    });

    it('when data is loaded, the player name gets rendered', () => {
        const playerName = 'Mock';
        const container = shallow(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue, chosenGame: GameNames.game1 }}>
                    <PlayerContext.Provider value={{ ...defaultValue, playerNumber: 1, name: playerName }}>
                        <Lobby history={history} />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );
        expect(container.findWhere(node => node.text() === playerName)).toBeTruthy();
    });

    it('should render player character', () => {
        const character = characters[0];
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue, chosenGame: GameNames.game1 }}>
                    <PlayerContext.Provider value={{ ...defaultValue, playerNumber: 1, character }}>
                        <Lobby history={history} />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(container.find('img').at(0).prop('src')).toEqual(character.src);
    });

    it('when user is not ready, ready button should have defined background and text color', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <ReadyButton ready={false} />
            </ThemeProvider>
        );

        expect(container.find('div')).toHaveStyleRule('background-color', theme.colors.readyButton);
        expect(container.find('div')).toHaveStyleRule('color', 'white');
    });

    it('when user is ready, ready button should have defined background and text color', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <ReadyButton ready={true} />
            </ThemeProvider>
        );

        expect(container.find('div')).toHaveStyleRule('background-color', theme.colors.playerName);
        expect(container.find('div')).toHaveStyleRule('color', 'black');
    });
});
