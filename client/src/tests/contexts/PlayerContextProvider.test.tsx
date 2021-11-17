import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import React from 'react';

import { Lobby } from '../../components/controller/Lobby';
import { ControllerSocketContext, defaultValue } from '../../contexts/ControllerSocketContextProvider';
import PlayerContextProvider from '../../contexts/PlayerContextProvider';
import { InMemorySocketFake } from '../../domain/socket/InMemorySocketFake';
import { UserInitMessage } from '../../domain/typeGuards/userInit';
import { MessageTypes } from '../../utils/constants';

configure({ adapter: new Adapter() });

describe('PlayerContextProvider', () => {
    it('When userInitMessage is emitted to controller socket, the PlayerContextProvider should provide the data', () => {
        const history = createMemoryHistory();
        const userName = 'Monster';
        const socket = new InMemorySocketFake();
        const message: UserInitMessage = {
            type: MessageTypes.userInit,
            userId: '1',
            name: userName,
            roomId: 'ABDE',
            isAdmin: true,
            number: 1,
            ready: true,
        };

        const container = mount(
            <ControllerSocketContext.Provider value={{ ...defaultValue, controllerSocket: socket }}>
                <PlayerContextProvider>
                    <Lobby history={history} />
                </PlayerContextProvider>
            </ControllerSocketContext.Provider>
        );

        socket.emit(message);

        expect(container.findWhere(node => node.text() === userName)).toBeTruthy();
    });
});
