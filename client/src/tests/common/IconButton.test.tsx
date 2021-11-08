import 'jest-styled-components';

import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import IconButton from '../../components/common/IconButton';
import theme from '../../styles/theme';

afterEach(cleanup);
describe('IconButton', () => {
    it('when the button is clicked, it the onClick handler', () => {
        const onClick = jest.fn();
        const { container } = render(
            <ThemeProvider theme={theme}>
                <IconButton onClick={onClick}>Test</IconButton>
            </ThemeProvider>
        );
        const button = container.querySelector('button');
        if (button) {
            fireEvent.click(button);
            expect(onClick).toHaveBeenCalledTimes(1);
        }
    });
});
