/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';

import LinearProgressBar from '../../../domain/game1/controller/components/obstacles/LinearProgressBar';
import Spider from '../../../domain/game1/controller/components/obstacles/Spider';
import { Navigator, UserMediaProps } from '../../../domain/navigator/Navigator';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(() => {
    jest.clearAllMocks();
    cleanup();
});

describe('Spider', () => {
    window.AudioContext = jest.fn().mockImplementation(() => {
        return {};
    });

    it('renders a LinearProgressBar', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Spider navigator={new NavigatorFake('granted')} />
            </ThemeProvider>
        );
        expect(container.find(LinearProgressBar)).toBeTruthy();
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
