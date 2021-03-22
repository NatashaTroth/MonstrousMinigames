import { queryByText, render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import renderer from 'react-test-renderer'

import Impressum from './Impressum'

describe('Impressum', () => {
    it('render correctly Impressum component', () => {
        const ImpressumComponent = renderer
            .create(
                <Router>
                    <Impressum />
                </Router>
            )
            .toJSON()
        expect(ImpressumComponent).toMatchSnapshot()
    })

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
