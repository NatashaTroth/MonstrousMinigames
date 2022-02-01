/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

import { defaultValue, Game1Context } from '../../../contexts/game1/Game1ContextProvider';
import Spider from '../../../domain/game1/controller/components/obstacles/Spider';
import { Navigator, UserMediaProps } from '../../../domain/navigator/Navigator';
import theme from '../../../styles/theme';
import { ObstacleTypes } from '../../../utils/constants';

configure({ adapter: new Adapter() });

afterEach(() => {
    jest.clearAllMocks();
    cleanup();
});

describe('Spider', () => {
    window.AudioContext = jest.fn().mockImplementation(() => {
        return {};
    });

    it('when SkipButton is clicked, solveObstacle should be called', () => {
        const setObstacle = jest.fn();
        jest.useFakeTimers(); // mock timers
        const obstacle = { id: 1, type: ObstacleTypes.spider };
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Game1Context.Provider value={{ ...defaultValue, setObstacle, obstacle }}>
                    <Spider navigator={new NavigatorFake('granted')} />
                </Game1Context.Provider>
            </ThemeProvider>
        );

        act(() => {
            jest.runAllTimers(); // trigger setTimeout
        });

        const button = container.querySelector('button');

        if (button) {
            fireEvent.click(button);
            expect(setObstacle).toHaveBeenCalledTimes(1);
        }
    });
});

class NavigatorFake implements Navigator {
    public mediaDevices?: {
        getUserMedia?: (val: UserMediaProps) => Promise<MediaStream | null | Error> | undefined;
    } = {};

    constructor(public val: string, public existingMediaDevices = true, public existingGetUserMedia = true) {
        this.mediaDevices = existingMediaDevices
            ? {
                  getUserMedia: (values: UserMediaProps) =>
                      existingGetUserMedia
                          ? new Promise<MediaStream | null | Error>(resolve => {
                                if (val === 'granted') {
                                    resolve({
                                        active: false,
                                        id: '1',
                                        onaddtrack: jest.fn(),
                                        onremovetrack: jest.fn(),
                                        addTrack: jest.fn(),
                                        clone: jest.fn(),
                                        getAudioTracks: jest.fn(),
                                        getTrackById: jest.fn(),
                                        getTracks: () => [],
                                        getVideoTracks: jest.fn(),
                                        removeTrack: jest.fn(),
                                        addEventListener: jest.fn(),
                                        removeEventListener: jest.fn(),
                                        dispatchEvent: jest.fn(),
                                    });
                                } else if (val === 'denied') {
                                    resolve(null);
                                } else if (val === 'error') {
                                    resolve(new Error('getUserMedia does not exist'));
                                }
                            })
                          : undefined,
              }
            : undefined;
    }
}
