/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Lobby } from '../../../components/controller/Lobby';
import { ReadyButton } from '../../../components/controller/Lobby.sc';
import { GameNames } from '../../../config/games';
import { defaultValue as defaultGameValue, GameContext } from '../../../contexts/GameContextProvider';
import { defaultValue, PlayerContext } from '../../../contexts/PlayerContextProvider';
import history from '../../../domain/history/history';
import theme from '../../../styles/theme';
import { controllerChooseCharacterRoute } from '../../../utils/routes';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Lobby', () => {
    it('when button "Change Character" is clicked, the history should change to the choose character route', () => {
        const roomId = 'ABCD';
        const location = `${controllerChooseCharacterRoute(roomId)}`;
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue, roomId, chosenGame: GameNames.game1 }}>
                    <PlayerContext.Provider value={{ ...defaultValue, playerNumber: 1 }}>
                        <Lobby history={history} />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );

        container.find('button').at(1).simulate('click');

        expect(history.location).toHaveProperty('pathname', location);
    });

    it('when ready button is clicked, handed setReady function should be called', () => {
        const setReady = jest.fn();
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue, chosenGame: GameNames.game1 }}>
                    <PlayerContext.Provider value={{ ...defaultValue, playerNumber: 1, setReady }}>
                        <Lobby history={history} />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );

        container.find(ReadyButton).simulate('click');

        expect(setReady).toHaveBeenCalledTimes(1);
    });

    it('when ready button is clicked, the instructions should change', () => {
        const givenText = `Wait for the admin to start your game!`;
        const setReady = jest.fn();
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue, chosenGame: GameNames.game1 }}>
                    <PlayerContext.Provider value={{ ...defaultValue, playerNumber: 1, setReady }}>
                        <Lobby history={history} />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );

        container.find(ReadyButton).simulate('click');

        expect(container.findWhere(node => node.text() === givenText)).toBeTruthy();
    });
});
