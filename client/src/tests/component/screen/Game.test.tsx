/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { Router } from 'react-router-dom';
import 'jest-canvas-mock';

import Game from '../../../domain/game1/screen/components/Game';
import { AudioButton, PauseButton } from '../../../domain/game1/screen/components/Game.sc';
import history from '../../../domain/history/history';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Game1', () => {
    it('renders pause button', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <Game />
                </Router>
            </ThemeProvider>
        );

        expect(container.find(PauseButton)).toBeTruthy();
    });

    it('renders audio button', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <Game />
                </Router>
            </ThemeProvider>
        );

        expect(container.find(AudioButton)).toBeTruthy();
    });

    it('renders div for phaser game', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <Game />
                </Router>
            </ThemeProvider>
        );

        expect(container.find('#game-root')).toBeTruthy();
    });
});
