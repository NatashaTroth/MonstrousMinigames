// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup, queryByText, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import React from 'react';

import { ControllerSocketContext, defaultValue } from '../../../contexts/controller/ControllerSocketContextProvider';
import JoyStick, {
    emitKillMessage,
    getDirectionforPos,
    handleStop,
} from '../../../domain/game2/controller/components/Joystick';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import theme from '../../../styles/theme';
import { MessageTypesGame2 } from '../../../utils/constants';
import { LocalStorageFake } from '../../storage/LocalFakeStorage';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Joystick', () => {
    const sessionStorage = new LocalStorageFake();

    it('renders steal sheep button', async () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <JoyStick sessionStorage={sessionStorage} />
            </ThemeProvider>
        );

        const button = container.find('button');
        expect(button.text.toString().match('Steal Sheep'));
    });

    it('renders instructions', async () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <JoyStick sessionStorage={sessionStorage} />
            </ThemeProvider>
        );

        const instructionText = 'Use the Joystick to Move';
        expect(queryByText(container, instructionText)).toBeTruthy();
    });

    it('has default remaining steals', () => {
        const defaultSteals = 5;
        const { container } = render(
            <ThemeProvider theme={theme}>
                <JoyStick sessionStorage={sessionStorage} />
            </ThemeProvider>
        );
        const givenText = 'Remaining decoys: '.concat(defaultSteals.toString());
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('renders remaining kills from sessionStorage', () => {
        const newStealNumber = 5;
        sessionStorage.setItem('remainingKills', newStealNumber);
        const { container } = render(
            <ThemeProvider theme={theme}>
                <JoyStick sessionStorage={sessionStorage} />
            </ThemeProvider>
        );
        const givenText = 'Remaining decoys: '.concat(newStealNumber.toString());
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('renders round number', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <JoyStick sessionStorage={sessionStorage} />
            </ThemeProvider>
        );
        expect(queryByText(container, 'Round 1')).toBeTruthy();
    });

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

describe('Joystick emitKillMessage', () => {
    it('should emit chooseSheep to socket', async () => {
        const socket = new FakeInMemorySocket();
        const userId = '1';

        await emitKillMessage(userId, socket);

        expect(socket.emitedVals).toEqual([
            {
                type: MessageTypesGame2.chooseSheep,
                userId,
            },
        ]);
    });
});

describe('Joystick handleStop', () => {
    it('should emit movePlayer to socket', async () => {
        const socket = new FakeInMemorySocket();
        const userId = '1';

        await handleStop(userId, socket);

        expect(socket.emitedVals).toEqual([
            {
                type: MessageTypesGame2.movePlayer,
                userId: userId,
                direction: 'C',
            },
        ]);
    });
});

describe('Joystick getDirectionforPos', () => {
    it('should return C when x and y smaller than 20', async () => {
        expect(getDirectionforPos(10, 10)).toEqual('C');
    });

    it('should return C when x and y smaller than 20', async () => {
        expect(getDirectionforPos(10, 10)).toEqual('C');
    });

    it('should return E when x is bigger than 20 and y smaller than 20', async () => {
        expect(getDirectionforPos(40, 10)).toEqual('E');
    });

    it('should return W when x is smaller than -20 and y smaller than 20', async () => {
        expect(getDirectionforPos(-40, 10)).toEqual('W');
    });

    it('should return NE when x is bigger than -35 and 35 and y is bigger than 20', async () => {
        expect(getDirectionforPos(40, 40)).toEqual('NE');
    });

    it('should return NW when x is smaller than -35 and y is bigger than 20', async () => {
        expect(getDirectionforPos(-40, 40)).toEqual('NW');
    });

    it('should return SE when x is bigger than -35 and 35 and y is smaller than -20', async () => {
        expect(getDirectionforPos(40, -40)).toEqual('SE');
    });

    it('should return NS when x is smaller than -35 and y is smaller than -20', async () => {
        expect(getDirectionforPos(-40, -40)).toEqual('SW');
    });
});
