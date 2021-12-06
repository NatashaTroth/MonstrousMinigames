import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { ConnectScreen } from '../../components/controller/ConnectScreen';
import ControllerSocketContextProvider from '../../contexts/ControllerSocketContextProvider';
import * as connectedUsersHandler from '../../domain/commonGameState/controller/connectedUsersHandler';
import theme from '../../styles/theme';

configure({ adapter: new Adapter() });

jest.mock('../../domain/commonGameState/controller/connectedUsersHandler', () => ({
    connectedUsersHandler: jest.fn(),
}));

afterAll(() => {
    jest.clearAllMocks();
    global.localStorage.clear();
});

describe('ControllerSocketContextProvider', () => {
    it('connectedUsersHandler should be called in Context', () => {
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

        expect(connectedUsersHandler.connectedUsersHandler).toHaveBeenCalledTimes(1);
    });
});
