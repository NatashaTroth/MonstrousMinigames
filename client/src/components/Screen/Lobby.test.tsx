import { cleanup, queryByText, render } from '@testing-library/react'
import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { Lobby } from './Lobby'

afterEach(cleanup)
describe('Screen Lobby', () => {
    it('renders text "Connected Users"', () => {
        const givenText = 'Connected Users'
        const { container } = render(
            <Router>
                <Lobby />
            </Router>
        )
        expect(queryByText(container, givenText)).toBeTruthy()
    })
})
