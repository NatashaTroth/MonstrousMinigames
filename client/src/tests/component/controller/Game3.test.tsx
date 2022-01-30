import { act, queryByText, render, waitFor } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { defaultValue, Game3Context, Vote } from '../../../contexts/game3/Game3ContextProvider';
import Game3, { getInstruction } from '../../../domain/game3/screen/components/Game3';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

describe('Game3', () => {
    it('should render roundIdx', () => {
        const roundIdx = 1;
        const givenText = `Round ${roundIdx}`;
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Game3Context.Provider value={{ ...defaultValue, roundIdx }}>
                    <Game3 />
                </Game3Context.Provider>
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('should render final round when roundIdx is 3', () => {
        const givenText = `Final Round`;
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Game3Context.Provider value={{ ...defaultValue, roundIdx: 3 }}>
                    <Game3 />
                </Game3Context.Provider>
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('renders as much images as photoUrls', async () => {
        const voteForPhotoMessage: Vote = {
            countdownTime: 1000,
            photoUrls: [
                {
                    photoId: 123452,
                    photographerId: '1sdfsdf',
                    url: 'url1',
                },
                {
                    photoId: 2234,
                    photographerId: '2sdfsd',
                    url: 'url2',
                },
            ],
        };
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Game3Context.Provider value={{ ...defaultValue, roundIdx: 1, voteForPhotoMessage }}>
                    <Game3 />
                </Game3Context.Provider>
            </ThemeProvider>
        );

        act(() => {
            jest.setTimeout(2000);
        });

        await waitFor(() => {
            expect(container.getElementsByTagName('img')).toHaveLength(voteForPhotoMessage.photoUrls!.length);
        });
    });
});

describe('getInstruction', () => {
    it('should render initial instruction when no other properties are given', () => {
        const givenText = 'Take a picture that represents the word';
        const { container } = render(
            <ThemeProvider theme={theme}>
                {getInstruction(undefined, undefined, false, undefined, undefined)}
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('should render topic when it is not the final round and there are no voting results', () => {
        const givenText = 'Snake';
        const { container } = render(
            <ThemeProvider theme={theme}>
                {getInstruction(undefined, undefined, false, undefined, givenText)}
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('should render final round instruction when final round is true', () => {
        const givenText =
            'Get inspired by the topics and take three photos. Later you will receive random photos from all uploaded photos. Use your imagination and present a short story about it containing one of the topics.';
        const { container } = render(
            <ThemeProvider theme={theme}>
                {getInstruction(undefined, undefined, true, undefined, undefined)}
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('should render result instruction when results are given', () => {
        const givenText = 'Results for this round';
        const { container } = render(
            <ThemeProvider theme={theme}>
                {getInstruction(undefined, undefined, false, { results: [], countdownTime: 200 }, undefined)}
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('should render instruction with name in final presentation round', () => {
        const presentFinalPhotos = { name: 'Jack', photographerId: '1', photoUrls: [], countdownTime: 200 };
        const givenText = `${presentFinalPhotos.name} - Tell us a story about the pictures on the screen`;
        const { container } = render(
            <ThemeProvider theme={theme}>
                {getInstruction(presentFinalPhotos, undefined, false, undefined, undefined)}
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('should render voting instruction when voteForPhotosMessage is given', () => {
        const voteForPhotosMessage = { countdownTime: 3000 };
        const givenText = `Vote on your smartphone for the picture that looks most like`;
        const { container } = render(
            <ThemeProvider theme={theme}>
                {getInstruction(undefined, voteForPhotosMessage, false, undefined, undefined)}
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('should render special voting instruction when voteForPhotosMessage is given and it is the final round', () => {
        const voteForPhotosMessage = { countdownTime: 3000 };
        const givenText = `Vote on your smartphone for the story that you liked the most`;
        const { container } = render(
            <ThemeProvider theme={theme}>
                {getInstruction(undefined, voteForPhotosMessage, true, undefined, undefined)}
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
