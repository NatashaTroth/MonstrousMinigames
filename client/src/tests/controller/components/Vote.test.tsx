/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';

import Vote from '../../../domain/game3/controller/components/Vote';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Vote', () => {
    it('renders as much buttons as images', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <Vote />
            </ThemeProvider>
        );

        expect(container.find('button')).toHaveLength(3);
    });
});
