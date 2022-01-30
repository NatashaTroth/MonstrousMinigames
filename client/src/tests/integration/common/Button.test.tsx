import 'jest-styled-components';

import { cleanup, fireEvent, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import Button from '../../../components/common/Button';
import theme from '../../../styles/theme';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Button', () => {
    it('when the button is clicked, it calls the onClick handler', () => {
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
});
