import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import renderer from 'react-test-renderer'

import Impressum from './Impressum'

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
