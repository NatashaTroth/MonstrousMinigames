/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup, queryByText, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

import theme from '../../../styles/theme';
import ChooseCharacter from './ChooseCharacter';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Choose Character', () => {
    it('renders a button with text "Choose Character"', () => {
        const givenText = 'Choose Character';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <ChooseCharacter />
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
