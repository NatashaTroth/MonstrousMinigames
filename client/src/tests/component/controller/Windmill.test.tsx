/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup, render } from '@testing-library/react';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';

import LinearProgressBar from '../../../domain/game1/controller/components/obstacles/LinearProgressBar';
import Windmill from '../../../domain/game1/controller/components/Windmill';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Windmill', () => {
    it('renders two images', () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Windmill />
            </ThemeProvider>
        );

        expect(container.querySelectorAll('img')).toHaveProperty('length', 2);
    });

    it('renders a LinearProgressBar', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Windmill />
            </ThemeProvider>
        );

        expect(container.find(LinearProgressBar)).toBeTruthy();
    });
});
