/* eslint-disable simple-import-sort/imports */

import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

import { SessionStorage } from '../../domain/storage/SessionStorage';

configure({ adapter: new Adapter() });

afterEach(cleanup);

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('Lokal Storage', () => {
    it('Session Storage class should persist data to session storage', () => {
        const sessionStorage = new SessionStorage();

        sessionStorage.setItem('roomId', 'ABCD');

        expect(global.sessionStorage.getItem('roomId')).toBe('ABCD');
    });

    it('Session Storage class should remove data from session storage', () => {
        global.sessionStorage.setItem('roomId', 'ABCD');

        const sessionStorage = new SessionStorage();

        sessionStorage.removeItem('roomId');

        expect(global.sessionStorage.getItem('roomId')).toBe(null);
    });

    it('Session Storage class should retrieve data from session storage', () => {
        global.sessionStorage.setItem('roomId', 'ABCD');

        const sessionStorage = new SessionStorage();

        expect(sessionStorage.getItem('roomId')).toBe('ABCD');
    });
});
