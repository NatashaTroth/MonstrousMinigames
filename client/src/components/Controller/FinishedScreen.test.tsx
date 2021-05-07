import { cleanup, fireEvent, queryByText, render } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';

import {
    ControllerSocketContext, defaultValue as controllerDefaultValue
} from '../../contexts/ControllerSocketContextProvider';
import {
    defaultValue as gameContextDefaultValue, GameContext
} from '../../contexts/GameContextProvider';
import { defaultValue, PlayerContext } from '../../contexts/PlayerContextProvider';
import history from '../../domain/history/history';
import { InMemorySocketFake } from '../../domain/socket/InMemorySocketFake';
import { FinishedScreen } from './FinishedScreen';

afterEach(cleanup);

describe('Screen FinishedScreen', () => {
    const socket = new InMemorySocketFake();

    const FinishedScreenComponent = (
        <ControllerSocketContext.Provider value={{ ...controllerDefaultValue, controllerSocket: socket }}>
            <FinishedScreen />
        </ControllerSocketContext.Provider>
    );

    it('when player reaches the goal, it renders text "Finished!"', () => {
        const givenText = 'Finished!';
        const { container } = render(
            <PlayerContext.Provider value={{ ...defaultValue, playerRank: 1 }}>
                {FinishedScreenComponent}
            </PlayerContext.Provider>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('when game has timed out and the player don`t reaches the goal, it renders text "Game has timed out"', () => {
        const givenText = 'Game has timed out';
        const { container } = render(
            <GameContext.Provider value={{ ...gameContextDefaultValue, hasTimedOut: true }}>
                <PlayerContext.Provider value={{ ...defaultValue, playerRank: undefined }}>
                    {FinishedScreenComponent}
                </PlayerContext.Provider>
            </GameContext.Provider>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('if user is admin, a button is rendered', () => {
        const { container } = render(
            <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: true }}>
                {FinishedScreenComponent}
            </PlayerContext.Provider>
        );

        expect(container.querySelectorAll('button')).toHaveProperty('length', 1);
    });

    it('if user is admin, a button is rendered with the given text', () => {
        const givenText = 'Back to Lobby';
        const { container } = render(
            <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: true }}>
                {FinishedScreenComponent}
            </PlayerContext.Provider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('if user is not admin, no button is rendered', () => {
        const { container } = render(
            <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: false }}>
                {FinishedScreenComponent}
            </PlayerContext.Provider>
        );

        expect(container.querySelectorAll('button')).toHaveProperty('length', 0);
    });

    it('user rank is rendered', () => {
        const givenText = '#1';
        const { container } = render(
            <PlayerContext.Provider value={{ ...defaultValue, playerRank: 1 }}>
                {FinishedScreenComponent}
            </PlayerContext.Provider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('when connect back to lobby is clicked, resetPlayer function should be called', () => {
        const onClick = jest.fn();
        const { container } = render(
            <Router history={history}>
                <PlayerContext.Provider value={{ ...defaultValue, resetPlayer: onClick }}>
                    {FinishedScreenComponent}
                </PlayerContext.Provider>
            </Router>
        );

        const button = container.querySelector('button');

        if (button) {
            fireEvent.click(button);
            expect(onClick).toHaveBeenCalledTimes(1);
        }
    });

    it('when connect back to lobby is clicked, resetGame function should be called', () => {
        const onClick = jest.fn();
        const { container } = render(
            <Router history={history}>
                <GameContext.Provider value={{ ...gameContextDefaultValue, resetGame: onClick }}>
                    {FinishedScreenComponent}
                </GameContext.Provider>
            </Router>
        );

        const button = container.querySelector('button');

        if (button) {
            fireEvent.click(button);
            expect(onClick).toHaveBeenCalledTimes(1);
        }
    });
});
