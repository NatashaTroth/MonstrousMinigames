import { cleanup, queryByText, render } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';

import { Lobby } from '../../components/Screen/Lobby';
import { defaultValue, GameContext } from '../../contexts/GameContextProvider';
import history from '../../utils/history';

afterEach(cleanup);
describe('Screen Lobby', () => {
    it('renders correct roomId', () => {
        const roomId = 'ABCDE';
        const givenText = `Room Code: ${roomId}`;
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
                name: 'User 1',
                roomId: 'ABCDE',
                number: 1,
            },
            {
                id: '2',
                name: 'User 2',
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
