import { cleanup, queryByText, render } from "@testing-library/react";
import React from "react";
import { Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { defaultValue, GameContext } from "../../contexts/GameContextProvider";
import history from "../../domain/history/history";
import theme from "../../styles/theme";
import { Lobby } from "./Lobby";

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
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <GameContext.Provider value={{ ...defaultValue, roomId }}>
                        <Lobby />
                    </GameContext.Provider>
                </Router>
            </ThemeProvider>
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
                characterNumber: 0,
                active: true,
                ready: true,
            },
            {
                id: '2',
                name: 'User 2'.toUpperCase(),
                roomId: 'ABCDE',
                number: 2,
                characterNumber: 1,
                active: true,
                ready: true,
            },
        ];

        const { container } = render(
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <GameContext.Provider value={{ ...defaultValue, connectedUsers }}>
                        <Lobby />
                    </GameContext.Provider>
                </Router>
            </ThemeProvider>
        );

        connectedUsers.forEach(user => {
            expect(queryByText(container, user.name)).toBeTruthy();
        });
    });
});
