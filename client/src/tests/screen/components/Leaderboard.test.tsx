import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import Leaderboard from '../../../components/screen/Leaderboard';
import { defaultValue, GameContext, GameType, LeaderboardState } from '../../../contexts/GameContextProvider';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });
afterEach(cleanup);

describe('Leaderboard', () => {
    const state: LeaderboardState = {
        gameHistory: [
            { game: GameType.GameOne, playerRanks: [{ id: '1', name: 'Mock', finished: true, isActive: true }] },
        ],
        userPoints: [{ userId: '1', name: 'Mock', points: 5, rank: 1 }],
    };
    it('should render user name from leaderboardstate', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <GameContext.Provider value={{ ...defaultValue, leaderboardState: state }}>
                    <Leaderboard />
                </GameContext.Provider>
            </ThemeProvider>
        );

        expect(container.findWhere(node => node.text() === 'Mock' && node.type() === 'div').length).toEqual(1);
    });
});
