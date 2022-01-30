/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { Router } from 'react-router-dom';
import 'jest-canvas-mock';
import React from 'react';

import { AudioButton, PauseButton } from '../../../domain/game1/screen/components/Game.sc';
import Game2 from '../../../domain/game2/screen/components/Game2';
import history from '../../../domain/history/history';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Game2', () => {
    it('renders pause button', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <Game2 />
                </Router>
            </ThemeProvider>
        );

        expect(container.find(PauseButton)).toBeTruthy();
    });

    it('renders audio button', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <Game2 />
                </Router>
            </ThemeProvider>
        );

        expect(container.find(AudioButton)).toBeTruthy();
    });
});
