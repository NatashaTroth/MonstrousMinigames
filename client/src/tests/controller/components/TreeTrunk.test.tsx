/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import React from 'react';

import { defaultValue, Game1Context } from '../../../contexts/game1/Game1ContextProvider';
import LinearProgressBar from '../../../domain/game1/controller/components/obstacles/LinearProgressBar';
import TreeTrunk, { solveObstacle } from '../../../domain/game1/controller/components/obstacles/TreeTrunk';
import {
    DragItem,
    Line,
    ObstacleItem,
    TouchContainer,
} from '../../../domain/game1/controller/components/obstacles/TreeTrunk.sc';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import theme from '../../../styles/theme';
import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('TreeTrunk', () => {
    it('renders LinearProgressBar', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <TreeTrunk />
            </ThemeProvider>
        );
        expect(container.find(LinearProgressBar)).toBeTruthy();
    });

    it('TouchContainer style should be have height 100px when orientation is horizontal', () => {
        const container = mount(<TouchContainer orientation="horizontal" />);
        expect(container.find('div')).toHaveStyleRule('height', '100px');
    });

    it('TouchContainer style should be have height 60% when orientation is vertical', () => {
        const container = mount(<TouchContainer orientation="vertical" />);
        expect(container.find('div')).toHaveStyleRule('height', '60%');
    });

    it('ObstacleItem style should rotate 32deg when orientation is horizontal', () => {
        const container = mount(<ObstacleItem orientation="horizontal" />);
        expect(container.find('div')).toHaveStyleRule('transform', 'rotate(32deg)');
    });

    it('ObstacleItem style should rotate 325deg when orientation is vertical', () => {
        const container = mount(<ObstacleItem orientation="vertical" />);
        expect(container.find('div')).toHaveStyleRule('transform', 'rotate(325deg)');
    });

    it('Line style should have border-top when orientation is horizontal', () => {
        const container = mount(<Line orientation="horizontal" />);
        expect(container.find('div')).toHaveStyleRule('border-top', '8px dashed white');
    });

    it('Line style should have border-left when orientation is vertical', () => {
        const container = mount(<Line orientation="vertical" />);
        expect(container.find('div')).toHaveStyleRule('border-left', '8px dashed white');
    });

    it('DrageItem style should have 30px top style and 0px left when orientation is horizontal', () => {
        const container = mount(<DragItem orientation="horizontal" failed={false} />);
        expect(container.find('div')).toHaveStyleRule('left', '0');
        expect(container.find('div')).toHaveStyleRule('top', '30px');
    });

    it('DrageItem style should have 30px left style and 0px top when orientation is vertical', () => {
        const container = mount(<DragItem orientation="vertical" failed={false} />);
        expect(container.find('div')).toHaveStyleRule('top', '0');
        expect(container.find('div')).toHaveStyleRule('left', '30px');
    });

    it('DrageItem style should have background-color red when failed is true', () => {
        const container = mount(<DragItem orientation="vertical" failed={true} />);
        expect(container.find('div')).toHaveStyleRule('background-color', 'red');
    });

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
});

describe('solveObstacle', () => {
    it('obstacleSolved should be emitted to socket', () => {
        const controllerSocket = new InMemorySocketFake();
        const obstacle = { id: 1, type: ObstacleTypes.treeStump };

        solveObstacle({
            controllerSocket,
            obstacle,
            setObstacle: jest.fn(),
            setShowInstructions: jest.fn(),
            roomId: 'ABCD',
        });

        expect(controllerSocket.emitedVals).toStrictEqual([
            {
                type: MessageTypesGame1.obstacleSolved,
                obstacleId: obstacle.id,
            },
        ]);
    });
});
