import 'jest-styled-components';

import { cleanup, fireEvent, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import * as React from 'react';
import { ThemeProvider } from 'styled-components';

import Button from '../../components/common/Button';
import { StyledButtonBase } from '../../components/common/Button.sc';
import theme from '../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Button', () => {
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

    it('button with variant primary uses primary color', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <StyledButtonBase variant="primary" />
            </ThemeProvider>
        );
        expect(container.find('button')).toHaveStyleRule('background', theme.palette.primary.main);
    });

    it('button with variant secondary uses secondary color', () => {
        const container = mount(
            <ThemeProvider theme={theme}>
                <StyledButtonBase variant="secondary" />
            </ThemeProvider>
        );
        expect(container.find('button')).toHaveStyleRule('background', theme.palette.secondary.main);
    });

    it('button with fullwidth property should have width: 100%', () => {
        const givenText = 'A Button';
        const container = mount(
            <ThemeProvider theme={theme}>
                <Button fullwidth>{givenText}</Button>
            </ThemeProvider>
        );

        expect(container.find('button')).toHaveStyleRule('width', '100%', { modifier: '&&' });
    });
});
