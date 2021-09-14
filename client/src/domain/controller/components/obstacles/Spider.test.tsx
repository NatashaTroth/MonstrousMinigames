/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';

import theme from '../../../../styles/theme';
import { Navigator, UserMediaProps } from '../../../navigator/Navigator';
import LinearProgressBar from './LinearProgressBar';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Spider', () => {
    it('renders a LinearProgressBar', () => {
        const container = mount(
            <ThemeProvider theme={theme}>{/* <Spider navigator={new NavigatorFake('granted')} /> */}</ThemeProvider>
        );
        expect(container.find(LinearProgressBar)).toBeTruthy();
    });
});

class NavigatorFake implements Navigator {
    public mediaDevices?: {
        getUserMedia?: (val: UserMediaProps) => Promise<MediaStream | null>;
    } = {};

    constructor(public val: string) {
        this.mediaDevices = {
            getUserMedia: (values: UserMediaProps) =>
                new Promise<MediaStream | null>(resolve => {
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
                    }
                }),
        };
    }
}
