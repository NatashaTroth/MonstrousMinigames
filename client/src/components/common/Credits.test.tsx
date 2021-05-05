import { queryByText, render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Credits from './Credits';

describe('Credits', () => {
    it('renders back button', () => {
        const buttonText = 'Back';
        const { container } = render(
            <Router>
                <Credits />
            </Router>
        );
        expect(queryByText(container, buttonText)).toBeTruthy();
    });
});
