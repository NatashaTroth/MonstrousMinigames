import { cleanup } from '@testing-library/react'
import React from 'react'
import renderer from 'react-test-renderer'

import FullScreenContainer from './FullScreenContainer'

afterEach(cleanup)
describe('FullScreenContainer', () => {
    it('renders given children', () => {
        const FullScreenContainerComponent = renderer
            .create(
                <FullScreenContainer>
                    <div>Text</div>
                </FullScreenContainer>
            )
            .toJSON()
        expect(FullScreenContainerComponent).toMatchSnapshot()
    })
})
