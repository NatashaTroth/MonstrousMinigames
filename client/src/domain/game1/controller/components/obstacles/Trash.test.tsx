/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';

import { defaultValue, Game1Context } from '../../../../../contexts/game1/Game1ContextProvider';
import food from '../../../../../images/obstacles/trash/food.svg';
import paper from '../../../../../images/obstacles/trash/paper.svg';
import plastic from '../../../../../images/obstacles/trash/plastic.svg';
import theme from '../../../../../styles/theme';
import { ObstacleTypes, TrashType } from '../../../../../utils/constants';
import LinearProgressBar from './LinearProgressBar';
import Trash, { generateRandomArray } from './Trash';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Trash', () => {
    it('renders a LinearProgressBar', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Trash />
            </ThemeProvider>
        );
        expect(container.find(LinearProgressBar)).toBeTruthy();
    });

    it('renders as much plastic images at given', () => {
        const numberTrashItems = 3;
        const obstacle = {
            id: 1,
            type: ObstacleTypes.trash,
            trashType: TrashType.Plastic,
            numberTrashItems,
        };
        const container = mount(
            <ThemeProvider theme={theme}>
                <Game1Context.Provider value={{ ...defaultValue, obstacle }}>
                    <Trash />
                </Game1Context.Provider>
            </ThemeProvider>
        );

        expect(container.findWhere(node => node.prop('src') === plastic)).toBeTruthy();
    });

    it('renders as much paper images at given', () => {
        const numberTrashItems = 3;
        const obstacle = {
            id: 1,
            type: ObstacleTypes.trash,
            trashType: TrashType.Paper,
            numberTrashItems,
        };
        const container = mount(
            <ThemeProvider theme={theme}>
                <Game1Context.Provider value={{ ...defaultValue, obstacle }}>
                    <Trash />
                </Game1Context.Provider>
            </ThemeProvider>
        );
        expect(container.findWhere(node => node.prop('src') === paper)).toBeTruthy();
    });

    it('renders as much paper images at given', () => {
        const numberTrashItems = 3;
        const obstacle = {
            id: 1,
            type: ObstacleTypes.trash,
            trashType: TrashType.Food,
            numberTrashItems,
        };
        const container = mount(
            <ThemeProvider theme={theme}>
                <Game1Context.Provider value={{ ...defaultValue, obstacle }}>
                    <Trash />
                </Game1Context.Provider>
            </ThemeProvider>
        );
        expect(container.findWhere(node => node.prop('src') === food)).toBeTruthy();
    });
});

describe('generateRandomArray', () => {
    it('must include as many obstacle types as given', () => {
        const trashType = TrashType.Paper;
        const numberTrashItems = 3;
        const randomArray = generateRandomArray({
            id: 1,
            type: ObstacleTypes.trash,
            trashType,
            numberTrashItems,
        });

        expect(randomArray.filter(item => item === trashType).length).toBe(numberTrashItems);
    });
});
