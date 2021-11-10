/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import React from 'react';

import TakePicture from '../../../domain/game3/controller/components/TakePicture';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('TakePicture', () => {
    it('renders a form', async () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <TakePicture />
            </ThemeProvider>
        );

        act(() => {
            jest.setTimeout(4000);
        });

        await waitFor(() => {
            expect(container.getElementsByTagName('form')).toHaveLength(1);
        });
    });
});
