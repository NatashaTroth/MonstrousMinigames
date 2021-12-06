import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import ConnectDialog from '../../components/screen/ConnectDialog';
import ScreenSocketContextProvider from '../../contexts/ScreenSocketContextProvider';
import theme from '../../styles/theme';

configure({ adapter: new Adapter() });

jest.mock('../../domain/socket/screen/handleSocketConnection', () => ({
    handleSocketConnection: jest.fn(),
}));

afterAll(() => {
    jest.clearAllMocks();
});

describe('ScreenSocketContextProvider', () => {
    xit('handleSocketConnection should be called in Context', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <ScreenSocketContextProvider>
                    <ConnectDialog open={true} handleClose={jest.fn()} />
                </ScreenSocketContextProvider>
            </ThemeProvider>
        );

        container.find('input').simulate('change', { target: { value: 'ADES' } });
        container.find('form').simulate('submit');

        // expect(socketConnection.handleSocketConnection).toHaveBeenCalledTimes(1);
    });
});
