import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import PlayersGetReady from '../../components/screen/PlayersGetReady';
import GameContextProvider from '../../contexts/GameContextProvider';
import theme from '../../styles/theme';

configure({ adapter: new Adapter() });

describe('GameContextProvider', () => {
    it('GameContextProvider should provide screenAdmin state', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContextProvider>
                    <PlayersGetReady />
                </GameContextProvider>
            </ThemeProvider>
        );
        expect(container.findWhere(node => node.type() === 'button' && node.text() === 'Start')).toHaveLength(0);
    });
});
