/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup, queryByText, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import Settings from '../../../components/common/Settings';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Settings', () => {
    it('renders "Sound" settings', () => {
        const givenText = 'Sound';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Settings />
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
