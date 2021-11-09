/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';

import TakePicture from '../../../domain/game3/controller/components/TakePicture';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('TakePicture', () => {
    it('renders a form', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <TakePicture />
            </ThemeProvider>
        );

        expect(container.find('form')).toHaveLength(1);
    });
});
