import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import PlayersGetReady from '../../components/screen/PlayersGetReady';
import { defaultValue } from '../../contexts/ControllerSocketContextProvider';
import GameContextProvider from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { InMemorySocketFake } from '../../domain/socket/InMemorySocketFake';
import { ScreenAdminMessage } from '../../domain/typeGuards/screenAdmin';
import theme from '../../styles/theme';
import { MessageTypes } from '../../utils/constants';

configure({ adapter: new Adapter() });

describe('GameContextProvider', () => {
    it('When userInitMessage is emitted to controller socket, the PlayerContextProvider should provide the data', () => {
        const socket = new InMemorySocketFake();
        const message: ScreenAdminMessage = {
            type: MessageTypes.screenAdmin,
            isAdmin: true,
        };

        const container = mount(
            <ThemeProvider theme={theme}>
                <ScreenSocketContext.Provider value={{ ...defaultValue, screenSocket: socket }}>
                    <GameContextProvider>
                        <PlayersGetReady />
                    </GameContextProvider>
                </ScreenSocketContext.Provider>
            </ThemeProvider>
        );

        socket.emit(message);

        expect(container.findWhere(node => node.type() === 'button' && node.text() === 'Start')).toBeTruthy();
    });
});
