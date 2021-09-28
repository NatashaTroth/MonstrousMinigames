/* eslint-disable simple-import-sort/imports */

import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

import { LocalStorage } from './LocalStorage';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Lokal Storage', () => {
    it('Local Storage class should persist data to local storage', () => {
        global.localStorage.clear();

        const localStorage = new LocalStorage();

        localStorage.setItem('roomId', 'ABCD');

        expect(global.localStorage.getItem('roomId')).toBe('ABCD');
    });

    it('Local Storage class should remove data from local storage', () => {
        global.localStorage.clear();
        global.localStorage.setItem('roomId', 'ABCD');

        const localStorage = new LocalStorage();

        localStorage.removeItem('roomId');

        expect(global.localStorage.getItem('roomId')).toBe(null);
    });

    it('Local Storage class should retrieve data from local storage', () => {
        global.localStorage.clear();
        global.localStorage.setItem('roomId', 'ABCD');

        const localStorage = new LocalStorage();

        expect(localStorage.getItem('roomId')).toBe('ABCD');
    });
});
