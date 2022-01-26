// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup, queryByText, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import React from 'react';

import theme from '../../../styles/theme';
import JoyStick from '../../../domain/game2/controller/components/Joystick';
import { LocalStorageFake } from '../../storage/LocalFakeStorage';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Joystick', () => {
    const sessionStorage = new LocalStorageFake();

    it('renders instructions', async () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <JoyStick sessionStorage={sessionStorage} />
            </ThemeProvider>
        );

        const button = container.find('button');
        expect(button.text.toString().match('Steal Sheep'));
    });

    it('renders steal sheep button', async () => {
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
        const givenText = 'Remaining kills: '.concat(defaultSteals.toString());
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
        const givenText = 'Remaining kills: '.concat(newStealNumber.toString());
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    // it('disables steal button if no steals left', () => {
    //     const newStealNumber = 0
    //     sessionStorage.setItem('remainingKills', newStealNumber);
    //     const container = mount(
    //         <ThemeProvider theme={theme}>
    //                 <JoyStick sessionStorage={sessionStorage}/>
    //         </ThemeProvider>
    //     );
    //     const button = container.find('button');
    //     button.simulate('click');
    //     expect(button.prop('disabled')).toBeTruthy();
    //     //expect(queryByText(container, "Remaining kills: 0")).toBeTruthy();
    //     // const button = container.find('button');
    //     // expect(button.prop('disabled')).toBeTruthy();
    // });

    it('renders round number', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <JoyStick sessionStorage={sessionStorage} />
            </ThemeProvider>
        );
        //const givenText = "Round ".concat(newRoundNumber.toString())
        expect(queryByText(container, 'Round 1')).toBeTruthy();
    });
});
