import { cleanup, queryByText, render } from '@testing-library/react'
import React from 'react'

import ShakeInstruction from '../../components/Controller/ShakeInstruction'

afterEach(cleanup)
describe('Controller ShakeInstruction', () => {
    it('renders instruction "SHAKE YOUR PHONE!"', () => {
        const givenText = 'SHAKE YOUR PHONE!'
        const { container } = render(<ShakeInstruction />)
        expect(queryByText(container, givenText)).toBeTruthy()
    })
})
