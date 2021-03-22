import { cleanup, queryByText, render } from '@testing-library/react'
import React from 'react'

import Lobby from './Lobby'

afterEach(cleanup)
describe('Screen Lobby', () => {
    it('renders text "Connected Users"', () => {
        const givenText = 'Connected Users'
        const { container } = render(<Lobby />)
        expect(queryByText(container, givenText)).toBeTruthy()
    })
})
