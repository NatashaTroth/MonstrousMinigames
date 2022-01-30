/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { CircularProgress } from '@material-ui/core';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import React from 'react';

import LoadingComponent from '../../../components/common/LoadingComponent';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

describe('LoadingComponent', () => {
    it('renders an CircularProgress', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <LoadingComponent />
            </ThemeProvider>
        );

        expect(container.find(CircularProgress)).toBeTruthy();
    });
});
