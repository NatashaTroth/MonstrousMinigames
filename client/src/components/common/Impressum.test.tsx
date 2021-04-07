import { queryByText, render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Impressum from './Impressum'

describe('Impressum', () => {
    it('renders back button', () => {
        const buttonText = 'Back'
        const { container } = render(
            <Router>
                <Impressum />
            </Router>
        )
        expect(queryByText(container, buttonText)).toBeTruthy()
    })
})
