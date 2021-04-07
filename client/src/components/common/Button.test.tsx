import 'jest-styled-components'

import { cleanup, queryByText, render } from '@testing-library/react'
import React from 'react'

import Button from './Button'

afterEach(cleanup)
describe('Button', () => {
    it('renders given text', () => {
        const givenText = 'A Button'
        const { container } = render(<Button text={givenText} />)
        expect(queryByText(container, givenText)).toBeTruthy()
    })
})
