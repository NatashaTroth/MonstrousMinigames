import { cleanup, queryByText, render } from '@testing-library/react'
import React from 'react'
import renderer from 'react-test-renderer'

import Button from './Button'

afterEach(cleanup)
describe('Button', () => {
    it('render correctly Button component', () => {
        const ButtonComponent = renderer.create(<Button text={'Click me'} />).toJSON()
        expect(ButtonComponent).toMatchSnapshot()
    })

    it('render disabled Button component', () => {
        const ButtonComponent = renderer.create(<Button text={'Click me'} disabled />).toJSON()
        expect(ButtonComponent).toMatchSnapshot()
    })

    it('renders given text', () => {
        const givenText = 'A Button'
        const { container } = render(<Button text={givenText} />)
        expect(queryByText(container, givenText)).toBeTruthy()
    })
})
