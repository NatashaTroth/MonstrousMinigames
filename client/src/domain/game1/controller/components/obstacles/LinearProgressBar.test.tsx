/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';

import theme from '../../../../../styles/theme';
import LinearProgressBar, { normalise } from './LinearProgressBar';
import { StyledLinearProgress } from './LinearProgressBar.sc';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('LinearProgressBar', () => {
    it('renders StyledLinearProgress', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <LinearProgressBar progress={20} />
            </ThemeProvider>
        );
        expect(container.find(StyledLinearProgress)).toBeTruthy();
    });

    it('renders StyledLinearProgress with MIN and MAX', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <LinearProgressBar progress={20} MIN={10} MAX={70} />
            </ThemeProvider>
        );
        expect(container.find(StyledLinearProgress)).toBeTruthy();
    });
});

describe('normalise function', () => {
    it('normalises progress', () => {
        const MIN = 0;
        const MAX = 50;
        const progress = 20;
        const value = (((progress > MAX ? MAX : progress) - MIN) * 100) / (MAX - MIN);

        expect(normalise(progress, MIN, MAX)).toBe(value);
    });

    it('handles value bigger than max', () => {
        const MIN = 0;
        const MAX = 50;
        const progress = 70;
        const value = (((progress > MAX ? MAX : progress) - MIN) * 100) / (MAX - MIN);

        expect(normalise(progress, MIN, MAX)).toBe(value);
    });
});
