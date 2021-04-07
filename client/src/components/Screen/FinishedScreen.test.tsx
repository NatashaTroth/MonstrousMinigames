import { cleanup, queryByText, render } from '@testing-library/react'
import React from 'react'

import { defaultValue, GameContext } from '../../contexts/GameContextProvider'
import { formatMs } from '../../utils/formatMs'
import { FinishedScreen } from './FinishedScreen'

afterEach(cleanup)
describe('Controller FinishedScreen', () => {
    it('renders text "Finished!"', () => {
        const givenText = 'Finished!'
        const { container } = render(<FinishedScreen />)
        expect(queryByText(container, givenText)).toBeTruthy()
    })

    it('users and their rank is rendered', () => {
        const playerRanks = [
            {
                id: 1,
                rank: 1,
                name: 'User 1',
                totalTimeInMs: 5000,
                finished: true,
                positionX: 0,
            },
            {
                id: 2,
                rank: 2,
                name: 'User 2',
                totalTimeInMs: 5600,
                finished: true,
                positionX: 0,
            },
        ]

        const { container } = render(
            <GameContext.Provider value={{ ...defaultValue, playerRanks }}>
                <FinishedScreen />
            </GameContext.Provider>
        )

        playerRanks.forEach(playerRank => {
            const givenText = `#${playerRank.rank} ${playerRank.name}`
            expect(queryByText(container, givenText)).toBeTruthy()
        })
    })

    it('users times are formatted and rendered', () => {
        const playerRanks = [
            {
                id: 1,
                rank: 1,
                name: 'User 1',
                totalTimeInMs: 5000,
                finished: true,
                positionX: 0,
            },
            {
                id: 2,
                rank: 2,
                name: 'User 2',
                totalTimeInMs: 5600,
                finished: true,
                positionX: 0,
            },
        ]

        const { container } = render(
            <GameContext.Provider value={{ ...defaultValue, playerRanks }}>
                <FinishedScreen />
            </GameContext.Provider>
        )

        playerRanks.forEach(playerRank => {
            const givenText = formatMs(playerRank.totalTimeInMs)
            expect(queryByText(container, givenText)).toBeTruthy()
        })
    })
})
