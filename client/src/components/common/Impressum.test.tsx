import React from 'react'
import renderer from 'react-test-renderer'
import Impressum from './Impressum'
import { BrowserRouter as Router } from 'react-router-dom'

describe('test Impressum component', () => {
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
})
