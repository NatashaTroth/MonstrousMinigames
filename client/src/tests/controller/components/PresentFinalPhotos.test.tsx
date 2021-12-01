import { cleanup, queryByText, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import Countdown from '../../../components/common/Countdown';
import { defaultValue, Game3Context } from '../../../contexts/game3/Game3ContextProvider';
import { defaultValue as playerDefaultValue, PlayerContext } from '../../../contexts/PlayerContextProvider';
import PresentFinalPhotos from '../../../domain/game3/controller/components/PresentFinalPhotos';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('PresentFinalPhotos', () => {
    it('renders a Countdown', async () => {
        const presentFinalPhotos = { photographerId: '1', name: 'Mock', photoUrls: [], countdownTime: 2000 };
        const container = mount(
            <ThemeProvider theme={theme}>
                <Game3Context.Provider value={{ ...defaultValue, presentFinalPhotos }}>
                    <PresentFinalPhotos />
                </Game3Context.Provider>
            </ThemeProvider>
        );

        expect(container.find(Countdown)).toHaveLength(1);
    });

    it('renders default instructions', async () => {
        const givenText = 'Listen to the other players';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <PresentFinalPhotos />
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('renders instructions when it is the users turn', async () => {
        const givenText = "It's your turn!";
        const presentFinalPhotos = { photographerId: '1', name: 'Mock', photoUrls: [], countdownTime: 2000 };
        const { container } = render(
            <ThemeProvider theme={theme}>
                <PlayerContext.Provider value={{ ...playerDefaultValue, userId: '1' }}>
                    <Game3Context.Provider value={{ ...defaultValue, presentFinalPhotos }}>
                        <PresentFinalPhotos />
                    </Game3Context.Provider>
                </PlayerContext.Provider>
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });
});
