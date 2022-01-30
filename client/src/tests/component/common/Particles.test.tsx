/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import React from 'react';

import { StyledParticles } from '../../../components/common/Particles.sc';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Particles', () => {
    it('renders a canvas element', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <StyledParticles />
            </ThemeProvider>
        );

        expect(container.find('canvas')).toBeTruthy();
    });
});
