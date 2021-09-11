// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '../../../styles/theme';
import history from '../../history/history';
import { checkRoomCode, ConnectScreen } from './ConnectScreen';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('ConnectScreen', () => {
    it('renders an iframe', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <ConnectScreen history={history} />
            </ThemeProvider>
        );

        expect(container.find('iframe')).toBeTruthy();
    });

    it('renders a button with text "Enter"', () => {
        const givenText = 'Enter';
        const container = mount(
            <ThemeProvider theme={theme}>
                <ConnectScreen history={history} />
            </ThemeProvider>
        );

        expect(container.find(givenText)).toBeTruthy();
    });
});

describe('CheckRoomCode', () => {
    it('returns room code if it matches the pattern', () => {
        expect(checkRoomCode('ABCD')).toBe('ABCD');
    });

    it('returns null if code is shorter than length of 4', () => {
        expect(checkRoomCode('ABC')).toBe(null);
    });

    it('returns null if code is longer than length of 4', () => {
        expect(checkRoomCode('ABCDE')).toBe(null);
    });
});
