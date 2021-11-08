import 'jest-styled-components';

import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import { StyledParticles } from '../../components/common/Particles.sc';
import theme from '../../styles/theme';

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
