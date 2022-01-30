// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import React from 'react';

import { ControllerSocketContext, defaultValue } from '../../../contexts/controller/ControllerSocketContextProvider';
import JoyStick from '../../../domain/game2/controller/components/Joystick';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import theme from '../../../styles/theme';
import { MessageTypesGame2 } from '../../../utils/constants';
import { LocalStorageFake } from '../../integration/storage/LocalFakeStorage';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Joystick', () => {
    const sessionStorage = new LocalStorageFake();

    it('should emit chooseSheep to socket when sheep button gets clicked', async () => {
        const socket = new FakeInMemorySocket();

        const container = mount(
            <ThemeProvider theme={theme}>
                <ControllerSocketContext.Provider value={{ ...defaultValue, controllerSocket: socket }}>
                    <JoyStick sessionStorage={sessionStorage} />
                </ControllerSocketContext.Provider>
            </ThemeProvider>
        );

        const button = container.find('button');
        button.simulate('click');

        expect(socket.emitedVals).toEqual([
            expect.objectContaining({
                type: MessageTypesGame2.chooseSheep,
            }),
        ]);
    });
});
