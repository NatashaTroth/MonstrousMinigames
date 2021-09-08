/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { CircularProgress } from '@material-ui/core';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount, shallow } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { characters } from '../../../config/characters';
import { defaultValue as defaultGameValue, GameContext } from '../../../contexts/GameContextProvider';
import { defaultValue, PlayerContext } from '../../../contexts/PlayerContextProvider';
import theme from '../../../styles/theme';
import { controllerChooseCharacterRoute } from '../../../utils/routes';
import history from '../../history/history';
import { Lobby } from './Lobby';
import { ReadyButton } from './Lobby.sc';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Lobby', () => {
    it('when data is loading, a CircularProgress is rendered', () => {
        const container = shallow(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue }}>
                    <PlayerContext.Provider value={{ ...defaultValue }}>
                        <Lobby history={history} />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );
        expect(container.find(CircularProgress)).toBeTruthy();
    });

    it('when data is loaded, an ready instruction is rendered', () => {
        const container = shallow(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue }}>
                    <PlayerContext.Provider value={{ ...defaultValue, playerNumber: 1 }}>
                        <Lobby history={history} />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );
        expect(container.findWhere(node => node.text() === `Show that you are ready to play!`)).toBeTruthy();
    });

    it('when data is loaded, the player name gets rendered', () => {
        const playerName = 'Test';
        const container = shallow(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue }}>
                    <PlayerContext.Provider value={{ ...defaultValue, playerNumber: 1, name: playerName }}>
                        <Lobby history={history} />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );
        expect(container.findWhere(node => node.text() === playerName)).toBeTruthy();
    });

    it('when button "Change Character" is clicked, the history should change', () => {
        const roomId = 'ABCD';
        const location = `${controllerChooseCharacterRoute(roomId)}`;
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue, roomId }}>
                    <PlayerContext.Provider value={{ ...defaultValue, playerNumber: 1 }}>
                        <Lobby history={history} />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );

        container.find('button').simulate('click');

        expect(history.location).toHaveProperty('pathname', location);
    });

    it('when ready button is clicked, handed setReady function should be called', () => {
        const setReady = jest.fn();
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue }}>
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
        const setReady = jest.fn();
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue }}>
                    <PlayerContext.Provider value={{ ...defaultValue, playerNumber: 1, setReady }}>
                        <Lobby history={history} />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );

        container.find(ReadyButton).simulate('click');

        expect(container.findWhere(node => node.text() === `Wait for the admin to start your game!`)).toBeTruthy();
    });

    it('should render player character', () => {
        const character = characters[0];
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue }}>
                    <PlayerContext.Provider value={{ ...defaultValue, playerNumber: 1, character }}>
                        <Lobby history={history} />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(container.find('img').at(0).prop('src')).toEqual(character.src);
    });

    it('should render player character', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <ReadyButton ready={false} />
            </ThemeProvider>
        );

        expect(container.find('div')).toHaveStyleRule('background-color', theme.colors.readyButton);
        expect(container.find('div')).toHaveStyleRule('color', 'white');
    });

    it('should render player character', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <ReadyButton ready={true} />
            </ThemeProvider>
        );

        expect(container.find('div')).toHaveStyleRule('background-color', theme.colors.playerName);
        expect(container.find('div')).toHaveStyleRule('color', 'black');
    });
});
