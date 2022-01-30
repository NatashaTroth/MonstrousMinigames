import 'jest-styled-components';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import Character from '../../../components/common/Character';
import { characters } from '../../../config/characters';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

describe('Character', () => {
    it('renders an image', () => {
        const image = characters[0].src;
        const container = mount(
            <ThemeProvider theme={theme}>
                <Character src={image} />
            </ThemeProvider>
        );

        expect(container.find('img').at(0).prop('src')).toEqual(image);
    });
});
