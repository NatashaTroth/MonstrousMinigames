import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import StealSheep from '../../../domain/game2/controller/components/StealSheep';
import sheep from '../../../images/characters/singleSheep.png';
import decoy from '../../../images/characters/spritesheets/sheep/sheep_decoy.png';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('StealSheep', () => {
    it('should render a sheep image', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <StealSheep />
            </ThemeProvider>
        );

        expect(container.find('img').at(0).prop('src')).toEqual(sheep);
    });

    it('should render a decoy image', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <StealSheep />
            </ThemeProvider>
        );

        expect(container.find('img').at(1).prop('src')).toEqual(decoy);
    });
});
