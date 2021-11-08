import 'jest-styled-components';

import { CircularProgress } from '@material-ui/core';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '../../styles/theme';
import LoadingComponent from './LoadingComponent';

configure({ adapter: new Adapter() });

afterEach(cleanup);

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
