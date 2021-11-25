/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup, queryByText, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import React from 'react';

import { defaultValue, Game1Context } from '../../../contexts/game1/Game1ContextProvider';
import ShakeInstruction from '../../../domain/game1/controller/components/ShakeInstruction';
import theme from '../../../styles/theme';
import { LocalStorageFake } from '../../storage/LocalFakeStorage';

configure({ adapter: new Adapter() });

afterEach(cleanup);

beforeAll(() => {
    global.sessionStorage = new LocalStorageFake();
});

describe('Shake Instruction', () => {
    it('renders an image', () => {
        const sessionStorage = new LocalStorageFake();

        const { container } = render(
            <ThemeProvider theme={theme}>
                <ShakeInstruction sessionStorage={sessionStorage} />
            </ThemeProvider>
        );

        expect(container.querySelectorAll('img')).toHaveProperty('length', 1);
    });

    it('renders no image when countdown is in session Storage', () => {
        const sessionStorage = new LocalStorageFake();

        sessionStorage.setItem('countdownTime', 3000);
        const { container } = render(
            <ThemeProvider theme={theme}>
                <ShakeInstruction sessionStorage={sessionStorage} />
            </ThemeProvider>
        );

        expect(container.querySelectorAll('img')).toHaveProperty('length', 0);
    });

    it('countodwn should be removed from session storage after timeout', () => {
        const sessionStorage = new LocalStorageFake();
        sessionStorage.setItem('countdownTime', 3000);

        render(
            <ThemeProvider theme={theme}>
                <ShakeInstruction sessionStorage={sessionStorage} />
            </ThemeProvider>
        );

        jest.setTimeout(3000);

        expect(global.sessionStorage.getItem('countdownTime')).toBe(null);
    });

    it('renders pebble instruction if user has stone', () => {
        const sessionStorage = new LocalStorageFake();
        const givenText = 'Click to use collected stone';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Game1Context.Provider value={{ ...defaultValue, hasStone: true }}>
                    <ShakeInstruction sessionStorage={sessionStorage} />
                </Game1Context.Provider>
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
