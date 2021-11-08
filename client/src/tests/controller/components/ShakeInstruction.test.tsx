/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup, render } from '@testing-library/react';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

import ShakeInstruction from '../../../domain/game1/controller/components/ShakeInstruction';
import theme from '../../../styles/theme';

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
});

class LocalStorageFake implements Storage {
    store: { [key: string]: string } = {};
    length = 0;

    clear() {
        this.store = {};
    }

    getItem(key: string) {
        return this.store[key] || null;
    }

    setItem(key: string, value: string | number) {
        this.store[key] = String(value);
        this.setLength();
    }

    removeItem(key: string) {
        delete this.store[key];
        this.setLength();
    }

    setLength() {
        this.length = Object.keys(this.store).length;
    }

    key(index: number) {
        return String(index);
    }
}
