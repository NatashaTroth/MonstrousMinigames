import { cleanup, queryByText, render } from '@testing-library/react';
import React from 'react';

import { Lobby } from '../../components/Controller/Lobby';
import { defaultValue as defaultGameValue, GameContext } from '../../contexts/GameContextProvider';
import { defaultValue, PlayerContext } from '../../contexts/PlayerContextProvider';

afterEach(cleanup);

describe('PlayerContextProvider', () => {
    it('when user is admin, a start game button is rendered', () => {
        const givenText = 'Start Game';
        const { container } = render(
            <GameContext.Provider value={{ ...defaultGameValue, gameChosen: true, tutorial: false }}>
                <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: true, playerNumber: 1 }}>
                    <Lobby />
                </PlayerContext.Provider>
            </GameContext.Provider>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('when user is admin, an instruction is rendered', () => {
        const givenText = 'Press the "Start Game" button to start the game.';
        const { container } = render(
            <GameContext.Provider value={{ ...defaultGameValue, gameChosen: true, tutorial: false }}>
                <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: true, playerNumber: 1, ready: true }}>
                    <Lobby />
                </PlayerContext.Provider>
            </GameContext.Provider>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('when user is not admin, some instructions are rendered', () => {
        const givenText = 'Wait for Player #1 to start your game!';
        const { container } = render(
            <GameContext.Provider value={{ ...defaultGameValue, gameChosen: true, tutorial: false }}>
                <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: false, playerNumber: 1, ready: true }}>
                    <Lobby />
                </PlayerContext.Provider>
            </GameContext.Provider>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('when data is loading, no instructions are rendered', () => {
        const givenText = 'Wait for Player #1 to start your game!';
        const { container } = render(
            <GameContext.Provider value={{ ...defaultGameValue }}>
                <PlayerContext.Provider value={{ ...defaultValue }}>
                    <Lobby />
                </PlayerContext.Provider>
            </GameContext.Provider>
        );
        expect(queryByText(container, givenText)).toBeFalsy();
    });
});
