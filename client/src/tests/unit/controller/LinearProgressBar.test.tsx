/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';

import LinearProgressBar from '../../../domain/game1/controller/components/obstacles/LinearProgressBar';
import { StyledLinearProgress } from '../../../domain/game1/controller/components/obstacles/LinearProgressBar.sc';
import theme from '../../../styles/theme';

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
