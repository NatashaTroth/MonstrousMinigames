import { cleanup, queryByText, render } from '@testing-library/react';
import React from 'react';

import { Lobby } from '../../components/Controller/Lobby';
import { defaultValue, PlayerContext } from '../../contexts/PlayerContextProvider';

afterEach(cleanup);

describe('PlayerContextProvider', () => {
    it('when user is admin, a start game button is rendered', () => {
        const givenText = 'Start Game';
        const { container } = render(
            <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: true }}>
                <Lobby />
            </PlayerContext.Provider>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('when user is admin, an instruction is rendered', () => {
        const givenText =
            'When all other players are ready, you have to press the "Start Game" button to start the game.';
        const { container } = render(
            <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: true }}>
                <Lobby />
            </PlayerContext.Provider>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('when user is not admin, some instructions are rendered', () => {
        const givenText = 'Wait until Player #1 starts the Game';
        const { container } = render(
            <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: false }}>
                <Lobby />
            </PlayerContext.Provider>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
