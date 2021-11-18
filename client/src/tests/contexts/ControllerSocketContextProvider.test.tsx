import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { ConnectScreen } from '../../components/controller/ConnectScreen';
import ControllerSocketContextProvider from '../../contexts/ControllerSocketContextProvider';
import * as socketConnection from '../../domain/socket/controller/handleSocketConnection';
import theme from '../../styles/theme';

configure({ adapter: new Adapter() });

jest.mock('../../domain/socket/controller/handleSocketConnection', () => ({
    handleSocketConnection: jest.fn(),
}));

afterAll(() => {
    jest.clearAllMocks();
    global.localStorage.clear();
});

describe('ControllerSocketContextProvider', () => {
    it('handleSocketConnection should be called in Context', () => {
        const history = createMemoryHistory();
        history.push('/ABDE');
        global.localStorage.setItem('name', 'Mock');
        const container = mount(
            <ThemeProvider theme={theme}>
                <ControllerSocketContextProvider permission={true}>
                    <ConnectScreen history={history} />
                </ControllerSocketContextProvider>
            </ThemeProvider>
        );

        container.find('form').simulate('submit');

        expect(socketConnection.handleSocketConnection).toHaveBeenCalledTimes(1);
    });
});
