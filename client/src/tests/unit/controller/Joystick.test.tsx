// eslint-disable-next-line simple-import-sort/imports
import "jest-styled-components";
import { cleanup, queryByText, render } from "@testing-library/react";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { configure, mount } from "enzyme";
import { ThemeProvider } from "styled-components";
import React from "react";

import JoyStick from "../../../domain/game2/controller/components/Joystick";
import theme from "../../../styles/theme";
import { LocalStorageFake } from "../../integration/storage/LocalFakeStorage";

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
});
