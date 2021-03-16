import { cleanup, queryByText, render } from '@testing-library/react'
import React from 'react'

import { FinishedScreen } from './FinishedScreen'

afterEach(cleanup)
describe('Screen FinishedScreen', () => {
    it('renders text "Finished!"', () => {
        const givenText = 'Finished!'
        const { container } = render(<FinishedScreen />)
        expect(queryByText(container, givenText)).toBeTruthy()
    })
})
