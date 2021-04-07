import { cleanup, queryByText, render } from '@testing-library/react'
import React from 'react'

import { defaultValue, PlayerContext } from '../../contexts/PlayerContextProvider'
import { FinishedScreen } from './FinishedScreen'

afterEach(cleanup)
describe('Screen FinishedScreen', () => {
    it('renders text "Finished!"', () => {
        const givenText = 'Finished!'
        const { container } = render(<FinishedScreen />)
        expect(queryByText(container, givenText)).toBeTruthy()
    })

    it('if user is admin, a button is rendered', () => {
        const { container } = render(
            <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: true }}>
                <FinishedScreen />
            </PlayerContext.Provider>
        )

        expect(container.querySelectorAll('button')).toHaveProperty('length', 1)
    })

    it('if user is admin, a button is rendered with the given text', () => {
        const givenText = 'Back to Lobby'
        const { container } = render(
            <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: true }}>
                <FinishedScreen />
            </PlayerContext.Provider>
        )

        expect(queryByText(container, givenText)).toBeTruthy()
    })

    it('if user is not admin, no button is rendered', () => {
        const { container } = render(
            <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: false }}>
                <FinishedScreen />
            </PlayerContext.Provider>
        )

        expect(container.querySelectorAll('button')).toHaveProperty('length', 0)
    })

    it('user rank is rendered', () => {
        const givenText = '#1'
        const { container } = render(
            <PlayerContext.Provider value={{ ...defaultValue, playerRank: 1 }}>
                <FinishedScreen />
            </PlayerContext.Provider>
        )

        expect(queryByText(container, givenText)).toBeTruthy()
    })
})
