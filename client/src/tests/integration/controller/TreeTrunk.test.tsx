/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { act, fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import React from 'react';

import { defaultValue, Game1Context } from '../../../contexts/game1/Game1ContextProvider';
import TreeTrunk from '../../../domain/game1/controller/components/obstacles/TreeTrunk';
import theme from '../../../styles/theme';
import { ObstacleTypes } from '../../../utils/constants';

it('when SkipButton is clicked, solveObstacle should be called', () => {
    const setObstacle = jest.fn();
    jest.useFakeTimers(); // mock timers
    const obstacle = { id: 1, type: ObstacleTypes.trash };
    const { container } = render(
        <ThemeProvider theme={theme}>
            <Game1Context.Provider value={{ ...defaultValue, setObstacle, obstacle }}>
                <TreeTrunk />
            </Game1Context.Provider>
        </ThemeProvider>
    );

    act(() => {
        jest.runAllTimers(); // trigger setTimeout
    });

    const button = container.querySelector('button');

    if (button) {
        fireEvent.click(button);
        expect(setObstacle).toHaveBeenCalledTimes(1);
    }
});
