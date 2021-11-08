/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup, queryByText, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '../../styles/theme';
import Settings, { updateVolume, volumeHasBeenUnmuted } from './Settings';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Settings', () => {
    it('renders "Sound Volume" settings', () => {
        const givenText = 'Sound Volume';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Settings />
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('volumeHasBeenUnmuted should return true if volume is 0 and new value is bigger than 0', () => {
        expect(volumeHasBeenUnmuted(5, 0)).toBe(true);
    });

    it('volumeHasBeenUnmuted should return false if volume is not null', () => {
        expect(volumeHasBeenUnmuted(5, 5)).toBe(false);
    });
});

describe('volumeHasBeenUnmuted Function', () => {
    it('should return true if volume is 0 and new value is bigger than 0', () => {
        expect(volumeHasBeenUnmuted(5, 0)).toBe(true);
    });

    it('should return false if volume is not null', () => {
        expect(volumeHasBeenUnmuted(5, 5)).toBe(false);
    });
});

describe('updateVolume Function', () => {
    it('pauseLobbyMusic should be called if newValue is 0', () => {
        const pauseLobbyMusic = jest.fn();
        const playLobbyMusic = jest.fn();
        const setAudioVolume = jest.fn();

        updateVolume(0, 0, pauseLobbyMusic, playLobbyMusic, setAudioVolume);
        expect(pauseLobbyMusic).toBeCalledTimes(1);
    });

    it('setAudioVolume should be called with newValue', async () => {
        const pauseLobbyMusic = jest.fn();
        const playLobbyMusic = jest.fn();
        const setAudioVolume = jest.fn();

        const newValue = 0;

        await updateVolume(newValue, 0, pauseLobbyMusic, playLobbyMusic, setAudioVolume);
        expect(setAudioVolume).toHaveBeenCalledWith(newValue);
    });

    it('playLobbyMusic should be called if newValue is bigger than 0 and volume is 0', () => {
        const pauseLobbyMusic = jest.fn();
        const playLobbyMusic = jest.fn();
        const setAudioVolume = jest.fn();

        updateVolume(5, 0, pauseLobbyMusic, playLobbyMusic, setAudioVolume);
        expect(playLobbyMusic).toBeCalledTimes(1);
    });
});
