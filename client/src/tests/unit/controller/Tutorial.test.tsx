import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import Tutorial from '../../../components/controller/Tutorial';
import { GameNames } from '../../../config/games';
import { defaultValue, GameContext } from '../../../contexts/GameContextProvider';
import TreeTrunk from '../../../domain/game1/controller/components/obstacles/TreeTrunk';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

describe('Tutorial', () => {
    const history = createMemoryHistory();

    it('should render TreeTrunk', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, chosenGame: GameNames.game1 }}>
                    <Tutorial history={history} />
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(container.find(TreeTrunk).length).toBe(1);
    });
});
