import { cleanup, fireEvent, queryByText, render } from '@testing-library/react'
import { createServer } from 'http'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Server } from 'socket.io'
import { io as clientIO, Socket } from 'socket.io-client'

import { FinishedScreen } from '../../components/Controller/FinishedScreen'
import { FinishedScreenContainer } from '../../components/Controller/FinishedScreen.sc'
import { defaultValue as gameContextDefaultValue, GameContext } from '../../contexts/GameContextProvider'
import { defaultValue, PlayerContext } from '../../contexts/PlayerContextProvider'

afterEach(cleanup)
describe('Screen FinishedScreen', () => {
    let controllerSocket: Socket | undefined = undefined
    // let serverSocket: Socket | undefined = undefined
    let io: any

    beforeAll(done => {
        const httpServer: any = createServer()
        io = new Server(httpServer)
        httpServer.listen(() => {
            const port = httpServer.address()!.port || 8080
            controllerSocket = clientIO(`http://localhost:${port}`)
            io.on('connection', (socket: Socket) => {
                // serverSocket = socket
            })
            controllerSocket.on('connect', done)
        })
    })

    afterAll(() => {
        io.close()

        if (controllerSocket) {
            controllerSocket.close()
        }
    })

    // it('if back to lobby button is clicked, a message should been emitted', done => {
    //     const { container } = render(
    //         <Router>
    //             <ControllerSocketContext.Provider value={{ ...controllerDefaultValue, controllerSocket }}>
    //                 <PlayerContext.Provider value={{ ...defaultValue, isPlayerAdmin: true }}>
    //                     <FinishedScreenContainer />
    //                 </PlayerContext.Provider>
    //             </ControllerSocketContext.Provider>
    //         </Router>
    //     )

    //     const button = container.querySelector('button')

    //     if (button) {
    //         fireEvent.click(button)
    //         done()

    //         // serverSocket!.on('message', (arg: any) => {
    //         //     expect(arg).toBe({ type: MESSAGETYPES.backToLobby })
    //         //     done()
    //         // })
    //     }
    // })

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

    it('when connect back to lobby is clicked, resetPlayer function should be called', () => {
        const onClick = jest.fn()
        const { container } = render(
            <Router>
                <PlayerContext.Provider value={{ ...defaultValue, resetPlayer: onClick }}>
                    <FinishedScreenContainer />
                </PlayerContext.Provider>
            </Router>
        )

        const button = container.querySelector('button')

        if (button) {
            fireEvent.click(button)
            expect(onClick).toHaveBeenCalledTimes(1)
        }
    })

    it('when connect back to lobby is clicked, resetGame function should be called', () => {
        const onClick = jest.fn()
        const { container } = render(
            <Router>
                <GameContext.Provider value={{ ...gameContextDefaultValue, resetGame: onClick }}>
                    <FinishedScreenContainer />
                </GameContext.Provider>
            </Router>
        )

        const button = container.querySelector('button')

        if (button) {
            fireEvent.click(button)
            expect(onClick).toHaveBeenCalledTimes(1)
        }
    })
})
