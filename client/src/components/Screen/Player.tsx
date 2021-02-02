import * as React from 'react'
import { Container, PlayerCharacter } from './Player.sc'
import { SocketContext } from '../../contexts/SocketContextProvider'
import oliver from '../../images/oliver.png'

interface IResponse {
    roomId: string
    type: string
    userId: string
}

const windowWidth = window.innerWidth
const step = windowWidth / 2000
// let counter = 0

const Player: React.FunctionComponent = () => {
    const { socket } = React.useContext(SocketContext)

    socket?.on('response', (data: IResponse) => {
        // eslint-disable-next-line no-console
        console.log('Got response')
        if (data.type === 'game1/runForward') {
            movePlayer()
        }
    })

    return (
        <Container id="player">
            <PlayerCharacter src={oliver} />
        </Container>
    )
}

export default Player

export interface IMovePlayer {
    setObstacle: (val: boolean) => void
    obstacleRemoved: boolean
    obstacle: boolean
}

function movePlayer() {
    const d = document.getElementById('player')

    if (d) {
        if (d.offsetLeft >= windowWidth - d.offsetWidth) {
            d.style.left = Number(windowWidth - d.offsetWidth) + 'px'
            const newPos = d.offsetTop + step
            d.style.top = newPos + 'px'
        } else {
            const newPos = d.offsetLeft + step
            d.style.left = newPos + 'px'
        }
    }
}
