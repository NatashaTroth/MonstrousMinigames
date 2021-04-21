import { cleanup, queryByText, render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { Lobby } from '../../components/Screen/Lobby'
import { defaultValue, GameContext } from '../../contexts/GameContextProvider'

afterEach(cleanup)
describe('Screen Lobby', () => {
    it('renders text "Connected Users"', () => {
        const givenText = 'Connected Users'
        const { container } = render(
            <Router>
                <Lobby />
            </Router>
        )
        expect(queryByText(container, givenText)).toBeTruthy()
    })

    it('renders correct roomId', () => {
        const roomId = 'ABCDE'
        const givenText = `Room Code: ${roomId}`
        const { container } = render(
            <Router>
                <GameContext.Provider value={{ ...defaultValue, roomId }}>
                    <Lobby />
                </GameContext.Provider>
            </Router>
        )
        expect(queryByText(container, givenText)).toBeTruthy()
    })

    it('renders copy to clipboard button', () => {
        const givenText = 'Copy to Clipboard'
        const { container } = render(
            <Router>
                <Lobby />
            </Router>
        )
        expect(queryByText(container, givenText)).toBeTruthy()
    })

    it('renders connected users', () => {
        const connectedUsers = [
            {
                id: '1',
                name: 'User 1',
                roomId: 'ABCDE',
            },
            {
                id: '2',
                name: 'User 2',
                roomId: 'ABCDE',
            },
        ]

        const { container } = render(
            <Router>
                <GameContext.Provider value={{ ...defaultValue, connectedUsers }}>
                    <Lobby />
                </GameContext.Provider>
            </Router>
        )

        connectedUsers.forEach(user => {
            expect(queryByText(container, user.name)).toBeTruthy()
        })
    })
})
