/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup, queryByText, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import Carousel from 'react-multi-carousel';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';

import theme from '../../../styles/theme';
import ChooseCharacter, { CustomLeftArrow, CustomRightArrow } from './ChooseCharacter';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Choose Character', () => {
    it('renders a button with text "Choose Character"', () => {
        const givenText = 'Choose Character';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <ChooseCharacter />
            </ThemeProvider>
        );

        expect(queryByText(container, givenText)).toBeTruthy();
    });

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
    it('renders an ArrowForwardIos Icon', () => {
        const handleOnClick = jest.fn();
        const container = mount(
            <ThemeProvider theme={theme}>
                <CustomRightArrow handleOnClick={handleOnClick} />
            </ThemeProvider>
        );

        expect(container.find(ArrowForwardIos)).toBeTruthy();
    });

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
    it('renders an ArrowBackIos Icon', () => {
        const handleOnClick = jest.fn();
        const container = mount(
            <ThemeProvider theme={theme}>
                <CustomLeftArrow handleOnClick={handleOnClick} />
            </ThemeProvider>
        );

        expect(container.find(ArrowBackIos)).toBeTruthy();
    });

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
