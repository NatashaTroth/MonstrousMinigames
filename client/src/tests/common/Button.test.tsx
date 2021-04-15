import 'jest-styled-components'

import { cleanup, fireEvent, queryByText, render } from '@testing-library/react'
import React from 'react'

import Button from '../../components/common/Button'

afterEach(cleanup)
describe('Button', () => {
    it('renders given text', () => {
        const givenText = 'A Button'
        const { container } = render(<Button text={givenText} />)
        expect(queryByText(container, givenText)).toBeTruthy()
    })

    it('when disabled prop is given, a disabled button is rendered', () => {
        const givenText = 'A Button'
        const { getByText } = render(<Button text={givenText} disabled />)
        expect(getByText(/A Button/i).closest('button')?.disabled).toBeTruthy()
    })

    it('when the button is clicked, it the onClick handler', () => {
        const givenText = 'A Button'
        const onClick = jest.fn()
        const { container } = render(<Button onClick={onClick} text={givenText} />)
        const button = container.querySelector('button')

        if (button) {
            fireEvent.click(button)
            expect(onClick).toHaveBeenCalledTimes(1)
        }
    })

    it('uses handed button type', () => {
        const givenText = 'A Button'
        const { getByText } = render(<Button type="submit" text={givenText} />)
        expect(getByText(/A Button/i).closest('button')?.type).toBe('submit')
    })
})
