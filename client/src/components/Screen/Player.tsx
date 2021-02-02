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

    // if (d) {
    //     if (!obstacleRemoved && d.offsetLeft >= windowWidth / 2 && counter === 0) {
    //         // eslint-disable-next-line no-console
    //         console.log('OBSTACLE')
    //         setObstacle(true)
    //         counter++
    //     } else if (!obstacle) {
    //         if (d.offsetLeft >= windowWidth - d.offsetWidth) {
    //             d.style.left = Number(windowWidth - d.offsetWidth) + 'px'
    //             const newPos = d.offsetTop + 5
    //             d.style.top = newPos + 'px'
    //         } else {
    //             const newPos = d.offsetLeft + 5
    //             d.style.left = newPos + 'px'
    //         }
    //     }
    // }

    if (d) {
        if (d.offsetLeft >= windowWidth - d.offsetWidth) {
            d.style.left = Number(windowWidth - d.offsetWidth) + 'px'
            const newPos = d.offsetTop + 5
            d.style.top = newPos + 'px'
        } else {
            const newPos = d.offsetLeft + 5
            d.style.left = newPos + 'px'
        }
    }
}
