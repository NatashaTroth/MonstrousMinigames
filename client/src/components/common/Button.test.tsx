import 'jest-styled-components';

import { cleanup, fireEvent, queryByText, render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '../../theme';
import Button from './Button';

afterEach(cleanup);
describe('Button', () => {
    it('renders given text', () => {
        const givenText = 'A Button';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Button>{givenText}</Button>
            </ThemeProvider>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('when disabled prop is given, a disabled button is rendered', () => {
        const givenText = 'A Button';
        const { getByText } = render(
            <ThemeProvider theme={theme}>
                <Button disabled>{givenText}</Button>
            </ThemeProvider>
        );
        expect(getByText(/A Button/i).closest('button')?.disabled).toBeTruthy();
    });

    it('when the button is clicked, it the onClick handler', () => {
        const givenText = 'A Button';
        const onClick = jest.fn();
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Button onClick={onClick}>{givenText}</Button>
            </ThemeProvider>
        );
        const button = container.querySelector('button');

        if (button) {
            fireEvent.click(button);
            expect(onClick).toHaveBeenCalledTimes(1);
        }
    });

    it('uses handed button type', () => {
        const givenText = 'A Button';
        const { getByText } = render(
            <ThemeProvider theme={theme}>
                <Button type="submit">{givenText}</Button>
            </ThemeProvider>
        );
        expect(getByText(/A Button/i).closest('button')?.type).toBe('submit');
    });
});
