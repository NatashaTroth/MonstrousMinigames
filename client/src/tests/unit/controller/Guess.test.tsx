// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import React from 'react';

import Guess from '../../../domain/game2/controller/components/Guess';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Guess', () => {
    it('renders one input', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Guess />
            </ThemeProvider>
        );

        expect(container.find('input')).toHaveLength(1);
    });
});
