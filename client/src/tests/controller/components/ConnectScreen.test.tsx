// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount, shallow } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import { createMemoryHistory } from 'history';
import React from 'react';

import { checkRoomCode, ConnectScreen, IFrameContent } from '../../../components/controller/ConnectScreen';
import { ControllerSocketContext, defaultValue } from '../../../contexts/controller/ControllerSocketContextProvider';
import history from '../../../domain/history/history';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('ConnectScreen', () => {
    it('renders an iframe', () => {
        const container = shallow(
            <ThemeProvider theme={theme}>
                <ConnectScreen history={history} />
            </ThemeProvider>
        );

        expect(container.find('iframe')).toBeTruthy();
    });

    it('roomId from history should be persisted to storage', () => {
        const history = createMemoryHistory();
        const roomId = 'ABCD';
        history.push(`/${roomId}`);

        mount(
            <ThemeProvider theme={theme}>
                <ConnectScreen history={history} />
            </ThemeProvider>
        );

        expect(global.sessionStorage.getItem('roomId')).toBe(roomId);
    });

    it('handleSocketConnection function should be called on submit', () => {
        const history = createMemoryHistory();
        const roomId = 'ABCD';
        history.push(`/${roomId}`);
        const handleSocketConnection = jest.fn();
        const container = mount(
            <ThemeProvider theme={theme}>
                <ControllerSocketContext.Provider value={{ ...defaultValue, handleSocketConnection }}>
                    <ConnectScreen history={history} />
                </ControllerSocketContext.Provider>
            </ThemeProvider>
        );

        const form = container.find('form');

        form.simulate('submit');

        expect(handleSocketConnection).toHaveBeenCalledTimes(1);
    });
});

describe('IFrameContent', () => {
    it('renders two inputs if no room code is in pathname', () => {
        const formState = { name: '', roomId: '' };
        const container = mount(
            <ThemeProvider theme={theme}>
                <IFrameContent roomId={null} setFormState={jest.fn()} formState={formState} />
            </ThemeProvider>
        );

        expect(container.find('input')).toHaveLength(2);
    });

    it('renders one input room code is handed', () => {
        const formState = { name: '', roomId: '' };
        const container = mount(
            <ThemeProvider theme={theme}>
                <IFrameContent roomId={'ABCD'} setFormState={jest.fn()} formState={formState} />
            </ThemeProvider>
        );

        expect(container.find('input')).toHaveLength(1);
    });

    it('setFormState should be called if room and name value changes', () => {
        const formState = { name: '', roomId: '' };
        const setFormState = jest.fn();
        const container = mount(
            <ThemeProvider theme={theme}>
                <IFrameContent roomId={null} setFormState={setFormState} formState={formState} />
            </ThemeProvider>
        );

        const nameInput = container.find('input').at(0);
        const roomInput = container.find('input').at(1);

        nameInput.simulate('focus');
        nameInput.simulate('change', { target: { value: 'Name' } });
        nameInput.simulate('keyDown', {
            which: 27,
            target: {
                blur() {
                    nameInput.simulate('blur');
                },
            },
        });

        roomInput.simulate('focus');
        roomInput.simulate('change', { target: { value: 'ABCD' } });
        roomInput.simulate('keyDown', {
            which: 27,
            target: {
                blur() {
                    roomInput.simulate('blur');
                },
            },
        });

        expect(setFormState).toHaveBeenCalledTimes(2);
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

    it('returns null if code is contains numbers', () => {
        expect(checkRoomCode('ABC8')).toBe(null);
    });
});
