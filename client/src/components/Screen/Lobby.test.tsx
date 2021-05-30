import { cleanup, queryByText, render } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';

import { Lobby } from '../../components/Screen/Lobby';
import { defaultValue, GameContext } from '../../contexts/GameContextProvider';
import history from '../../domain/history/history';

// window.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
// window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };

window.HTMLMediaElement.prototype.play = () => new Promise(resolve => resolve);
window.HTMLMediaElement.prototype.pause = () => {
    /* do nothing */
};
// window.HTMLMediaElement.prototype.addTextTrack = () => { /* do nothing */ };

afterEach(cleanup);
describe('Screen Lobby', () => {
    it('renders correct roomId', () => {
        const roomId = 'ABCDE';
        const givenText = `${roomId}`;
        const { container } = render(
            <Router history={history}>
                <GameContext.Provider value={{ ...defaultValue, roomId }}>
                    <Lobby />
                </GameContext.Provider>
            </Router>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('renders copy to clipboard button', () => {
        const givenText = 'Copy to Clipboard';
        const { container } = render(
            <Router history={history}>
                <Lobby />
            </Router>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('renders connected users', () => {
        const connectedUsers = [
            {
                id: '1',
                name: 'User 1'.toUpperCase(),
                roomId: 'ABCDE',
                number: 1,
            },
            {
                id: '2',
                name: 'User 2'.toUpperCase(),
                roomId: 'ABCDE',
                number: 2,
            },
        ];

        const { container } = render(
            <Router history={history}>
                <GameContext.Provider value={{ ...defaultValue, connectedUsers }}>
                    <Lobby />
                </GameContext.Provider>
            </Router>
        );

        connectedUsers.forEach(user => {
            expect(queryByText(container, user.name)).toBeTruthy();
        });
    });
});
