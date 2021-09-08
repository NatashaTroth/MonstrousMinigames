import { CircularProgress } from '@material-ui/core';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, shallow } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { defaultValue as defaultGameValue, GameContext } from '../../../contexts/GameContextProvider';
import { defaultValue, PlayerContext } from '../../../contexts/PlayerContextProvider';
import theme from '../../../styles/theme';
import { Lobby } from './Lobby';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Lobby', () => {
    it('when data is loading, a CircularProgress is rendered', () => {
        const container = shallow(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultGameValue }}>
                    <PlayerContext.Provider value={{ ...defaultValue }}>
                        <Lobby />
                    </PlayerContext.Provider>
                </GameContext.Provider>
            </ThemeProvider>
        );
        expect(container.find(CircularProgress)).toBeTruthy();
    });
});
