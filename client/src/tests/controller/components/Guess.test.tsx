// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import React from 'react';

import { ControllerSocketContext, defaultValue } from '../../../contexts/controller/ControllerSocketContextProvider';
import { defaultValue as playerDefaultValue, PlayerContext } from '../../../contexts/PlayerContextProvider';
import Guess from '../../../domain/game2/controller/components/Guess';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import theme from '../../../styles/theme';
import { MessageTypesGame2 } from '../../../utils/constants';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Guess', () => {
    it('renders one input', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Guess />
            </ThemeProvider>
        );

        expect(container.find('input')).toHaveLength(1);
    });

    it('guess should be submitted to socket if submit button is pressed', () => {
        const controllerSocket = new FakeInMemorySocket();
        const userId = '1';
        const guess = 5;

        const container = mount(
            <ThemeProvider theme={theme}>
                <ControllerSocketContext.Provider value={{ ...defaultValue, controllerSocket }}>
                    <PlayerContext.Provider value={{ ...playerDefaultValue, userId }}>
                        <Guess />
                    </PlayerContext.Provider>
                </ControllerSocketContext.Provider>
                ControllerS
            </ThemeProvider>
        );

        const guessInput = container.find('input').at(0);

        guessInput.simulate('focus');
        guessInput.simulate('change', { target: { value: guess } });
        guessInput.simulate('keyDown', {
            which: 27,
            target: {
                blur() {
                    guessInput.simulate('blur');
                },
            },
        });

        const form = container.find('form');

        form.simulate('submit');

        expect(controllerSocket.emitedVals).toEqual([
            {
                type: MessageTypesGame2.guess,
                userId,
                guess,
            },
        ]);
    });
});
