import 'jest-styled-components';

import { cleanup, fireEvent, queryByText, render } from '@testing-library/react';
import React from 'react';

import Button from './Button';

afterEach(cleanup);
describe('Button', () => {
    it('renders given text', () => {
        const givenText = 'A Button';
        const { container } = render(<Button>{givenText}</Button>);
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('when disabled prop is given, a disabled button is rendered', () => {
        const givenText = 'A Button';
        const { getByText } = render(<Button disabled>{givenText}</Button>);
        expect(getByText(/A Button/i).closest('button')?.disabled).toBeTruthy();
    });

    it('when the button is clicked, it the onClick handler', () => {
        const givenText = 'A Button';
        const onClick = jest.fn();
        const { container } = render(<Button onClick={onClick}>{givenText}</Button>);
        const button = container.querySelector('button');

        if (button) {
            fireEvent.click(button);
            expect(onClick).toHaveBeenCalledTimes(1);
        }
    });

    it('uses handed button type', () => {
        const givenText = 'A Button';
        const { getByText } = render(<Button type="submit">{givenText}</Button>);
        expect(getByText(/A Button/i).closest('button')?.type).toBe('submit');
    });
});
