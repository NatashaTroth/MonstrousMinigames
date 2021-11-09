/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import Carousel from 'react-multi-carousel';
import { createMemoryHistory } from 'history';

import ChooseCharacter, {
    chooseCharacterClick,
    CustomLeftArrow,
    CustomRightArrow,
} from '../../../components/controller/ChooseCharacter';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import theme from '../../../styles/theme';
import { MessageTypes } from '../../../utils/constants';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Choose Character', () => {
    it('renders as a carousel', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <ChooseCharacter />
            </ThemeProvider>
        );

        expect(container.find(Carousel)).toBeTruthy();
    });
});

describe('CustomRightArrow', () => {
    it('handed handleOnClick should be called when button gets clicked', () => {
        const handleOnClick = jest.fn();
        const container = mount(
            <ThemeProvider theme={theme}>
                <CustomRightArrow handleOnClick={handleOnClick} />
            </ThemeProvider>
        );

        container.find('button').simulate('click');

        expect(handleOnClick).toHaveBeenCalledTimes(1);
    });

    it('handed onClick should be called when button gets clicked', () => {
        const handleOnClick = jest.fn();
        const onClick = jest.fn();
        const container = mount(
            <ThemeProvider theme={theme}>
                <CustomRightArrow handleOnClick={handleOnClick} onClick={onClick} />
            </ThemeProvider>
        );

        container.find('button').simulate('click');

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});

describe('CustomLeftArrow', () => {
    it('handed handleOnClick should be called when button gets clicked', () => {
        const handleOnClick = jest.fn();
        const container = mount(
            <ThemeProvider theme={theme}>
                <CustomLeftArrow handleOnClick={handleOnClick} />
            </ThemeProvider>
        );

        container.find('button').simulate('click');

        expect(handleOnClick).toHaveBeenCalledTimes(1);
    });

    it('handed onClick should be called when button gets clicked', () => {
        const handleOnClick = jest.fn();
        const onClick = jest.fn();
        const container = mount(
            <ThemeProvider theme={theme}>
                <CustomLeftArrow handleOnClick={handleOnClick} onClick={onClick} />
            </ThemeProvider>
        );

        container.find('button').simulate('click');

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});

describe('chooseCharacterClick', () => {
    const props = {
        controllerSocket: new InMemorySocketFake(),
        setCharacter: jest.fn(),
        roomId: 'EDFS',
        actualCharacter: 0,
        history: createMemoryHistory(),
        characterIndex: -1,
    };

    it('should emit new character number to socket', () => {
        const controllerSocket = new InMemorySocketFake();

        chooseCharacterClick({ ...props, controllerSocket });

        expect(controllerSocket.emitedVals).toStrictEqual([
            {
                type: MessageTypes.selectCharacter,
                characterNumber: props.actualCharacter,
            },
        ]);
    });
});
