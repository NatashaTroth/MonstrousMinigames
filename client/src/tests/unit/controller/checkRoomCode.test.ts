// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

import { checkRoomCode } from '../../../components/controller/ConnectScreen';

configure({ adapter: new Adapter() });

afterEach(cleanup);

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

    it('returns null if code is contains numbers', () => {
        expect(checkRoomCode('ABC8')).toBe(null);
    });
});
