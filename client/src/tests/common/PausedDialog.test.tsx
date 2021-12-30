import 'jest-styled-components';

import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import PausedDialog from '../../components/common/PausedDialog';
import { defaultValue, GameContext } from '../../contexts/GameContextProvider';
import theme from '../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('PausedDialog', () => {
    it('does render "game has paused"', () => {
        const givenText = 'Game has paused';
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, hasPaused: true }}>
                    <PausedDialog />
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(container.findWhere(node => node.text() === givenText)).toBeTruthy();
    });
});
