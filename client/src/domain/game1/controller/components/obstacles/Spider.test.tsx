/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';

import { defaultValue, Game1Context } from '../../../../../contexts/game1/Game1ContextProvider';
import theme from '../../../../../styles/theme';
import { MessageTypesGame1, ObstacleTypes } from '../../../../../utils/constants';
import { Navigator, UserMediaProps } from '../../../../navigator/Navigator';
import { InMemorySocketFake } from '../../../../socket/InMemorySocketFake';
import LinearProgressBar from './LinearProgressBar';
import Spider, { solveObstacle } from './Spider';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Spider', () => {
    it('renders a LinearProgressBar', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Spider navigator={new NavigatorFake('granted')} />
            </ThemeProvider>
        );
        expect(container.find(LinearProgressBar)).toBeTruthy();
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

describe('solveObstacle', () => {
    it('obstacleSolved should be emitted to socket', () => {
        const controllerSocket = new InMemorySocketFake();
        const obstacle = { id: 1, type: ObstacleTypes.spider };

        solveObstacle({
            controllerSocket,
            obstacle,
            setObstacle: jest.fn(),
            clearTimeout: jest.fn(),
            handleSkip: setTimeout(() => {
                // do nothing
            }, 1000),
            roomId: 'ABCD',
        });

        expect(controllerSocket.emitedVals).toStrictEqual([
            {
                type: MessageTypesGame1.obstacleSolved,
                obstacleId: obstacle.id,
            },
        ]);
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
