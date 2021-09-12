import { cleanup, fireEvent, queryByText, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { defaultValue as screenDefaultValue, ScreenSocketContext } from '../../../contexts/ScreenSocketContextProvider';
import theme from '../../../styles/theme';
import { InMemorySocketFake } from '../../socket/InMemorySocketFake';
import { ConnectScreen } from './ConnectScreen';

afterEach(cleanup);
describe('Screen ConnectScreen', () => {
    const socket = new InMemorySocketFake();
    const ConnectScreenComponent = (
        <ThemeProvider theme={theme}>
            <ScreenSocketContext.Provider value={{ ...screenDefaultValue, screenSocket: socket }}>
                <ConnectScreen />
            </ScreenSocketContext.Provider>
        </ThemeProvider>
    );

    it('renders given button labels', () => {
        const buttonLabels = ['Create New Room', 'Join Room', 'About', 'Credits', 'Settings'];
        const { container } = render(
            ConnectScreenComponent
        );
        buttonLabels.forEach(label => {
            expect(queryByText(container, label)).toBeTruthy();
        });
        
    });

    it('renders 5 buttons', () => {
        const { container } = render(
            ConnectScreenComponent
        );
        const buttons = container.querySelectorAll('button');
        expect(buttons.length).toEqual(5)
    });

    it('each button is clickable and calls the onclick method', () => {
        const onClick = jest.fn()
        const { container } = render(
            ConnectScreenComponent
        );
        const buttons = container.querySelectorAll('button');
        if (buttons) {
            buttons.forEach(button => {
                button.onclick = onClick
                fireEvent.click(button);
                expect(onClick).toHaveBeenCalled();
            });
            expect(onClick).toHaveBeenCalledTimes(buttons.length);
       } 
    });

    
});
