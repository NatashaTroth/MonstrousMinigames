import 'jest-styled-components';

import { cleanup, queryByText, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import PausedDialog from '../../components/common/PausedDialog';
import { defaultValue, GameContext } from '../../contexts/GameContextProvider';
import theme from '../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('PausedDialog', () => {
    it('does not render "game has paused" on screen', () => {
        const givenText = 'Game has paused';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, hasPaused: true }}>
                    <PausedDialog />
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeFalsy();
    });
});
