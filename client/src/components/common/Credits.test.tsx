import { queryByText, render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import theme from '../../theme';
import Credits from './Credits';

describe('Credits', () => {
    it('renders back button', () => {
        const buttonText = 'Back';
        const { container } = render(
            <ThemeProvider theme={theme}>
                <Router>
                    <Credits />
                </Router>
            </ThemeProvider>
        );
        expect(queryByText(container, buttonText)).toBeTruthy();
    });
});
