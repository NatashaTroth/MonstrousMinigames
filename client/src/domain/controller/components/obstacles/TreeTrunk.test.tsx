/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';

import theme from '../../../../styles/theme';
import LinearProgressBar from './LinearProgressBar';
import TreeTrunk from './TreeTrunk';

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
});
