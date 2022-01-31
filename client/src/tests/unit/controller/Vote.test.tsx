/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';

import { defaultValue, Game3Context } from '../../../contexts/game3/Game3ContextProvider';
import { defaultValue as playerDefaultValue, PlayerContext } from '../../../contexts/PlayerContextProvider';
import Vote from '../../../domain/game3/controller/components/Vote';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Vote', () => {
    it('renders the heading', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Vote />
            </ThemeProvider>
        );

        expect(container.find('p')).toHaveLength(1);
    });

    it('renders as much buttons as photoUrls minus 1', async () => {
        const userId = '1';
        const voteForPhotoMessage = {
            photoUrls: [
                {
                    photographerId: '1',
                    photoId: 1,
                    url: '',
                },
                {
                    photographerId: '2',
                    photoId: 2,
                    url: '',
                },
            ],
            countdownTime: 30000,
        };
        const container = mount(
            <ThemeProvider theme={theme}>
                <PlayerContext.Provider value={{ ...playerDefaultValue, userId }}>
                    <Game3Context.Provider value={{ ...defaultValue, voteForPhotoMessage }}>
                        <Vote />
                    </Game3Context.Provider>
                </PlayerContext.Provider>
            </ThemeProvider>
        );

        expect(container.findWhere(node => node.type() === 'button').length).toEqual(
            voteForPhotoMessage.photoUrls.length - 1
        );
    });

    it('displays instructions after submit', async () => {
        const givenText = 'Your vote has been submitted, waiting for the others...';
        const userId = '1';
        const voteForPhotoMessage = {
            photoUrls: [
                {
                    photographerId: '1',
                    photoId: 1,
                    url: '',
                },
                {
                    photographerId: '2',
                    photoId: 2,
                    url: '',
                },
            ],
            countdownTime: 30000,
        };
        const container = mount(
            <ThemeProvider theme={theme}>
                <PlayerContext.Provider value={{ ...playerDefaultValue, userId }}>
                    <Game3Context.Provider value={{ ...defaultValue, voteForPhotoMessage }}>
                        <Vote />
                    </Game3Context.Provider>
                </PlayerContext.Provider>
            </ThemeProvider>
        );

        const button = container.find('button').first();
        button.simulate('click');

        expect(container.findWhere(node => node.text() === givenText && node.type() === 'p').length).toEqual(1);
    });
});
