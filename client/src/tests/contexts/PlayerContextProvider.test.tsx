import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Lobby } from '../../components/controller/Lobby';
import { GameNames } from '../../config/games';
import { defaultValue, GameContext } from '../../contexts/GameContextProvider';
import PlayerContextProvider from '../../contexts/PlayerContextProvider';
import history from '../../domain/history/history';
import theme from '../../styles/theme';

configure({ adapter: new Adapter() });

describe('PlayerContextProvider', () => {
    it('PlayerContextProvider should provide the ready state to the lobby', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, chosenGame: GameNames.game1 }}>
                    <PlayerContextProvider>
                        <Lobby history={history} />
                    </PlayerContextProvider>
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(
            container.findWhere(node => node.type() === 'div' && node.text() === 'Show that you are ready to play!')
        ).toHaveLength(1);
    });
});
