import React from 'react'
import renderer from 'react-test-renderer'
import Button from './Button'

describe('test Button component', () => {
    it('render correctly Button component', () => {
        const ButtonComponent = renderer.create(<Button text={'Click me'} />).toJSON()
        expect(ButtonComponent).toMatchSnapshot()
    })

    it('render disabled Button component', () => {
        const ButtonComponent = renderer.create(<Button text={'Click me'} disabled />).toJSON()
        expect(ButtonComponent).toMatchSnapshot()
    })
})
