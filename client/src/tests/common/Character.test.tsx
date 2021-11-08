import 'jest-styled-components';

import { cleanup, render } from '@testing-library/react';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import Character from '../../components/common/Character';
import { characters } from '../../config/characters';
import theme from '../../styles/theme';

afterEach(cleanup);

describe('Character', () => {
    it('renders an image', () => {
        const image = characters[0].src;
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Character src={image} />
            </ThemeProvider>
        );

        expect(container.querySelector('img')).toBeTruthy();
    });
});
