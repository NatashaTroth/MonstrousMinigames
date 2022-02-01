// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import { createMemoryHistory } from 'history';
import React from 'react';

import { ConnectScreen, IFrameContent } from '../../../components/controller/ConnectScreen';
import { ControllerSocketContext, defaultValue } from '../../../contexts/controller/ControllerSocketContextProvider';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('ConnectScreen', () => {
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
