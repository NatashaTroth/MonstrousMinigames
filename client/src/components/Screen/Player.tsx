/* eslint-disable no-console */
import * as React from 'react'
import { Container, PlayerCharacter } from './Player.sc'
import { SocketContext } from '../../contexts/SocketContextProvider'
import oliver from '../../images/oliver.png'

let speed = 1
let count = 0
interface IResponse {
    roomId: string
    type: string
    userId: string
}

const windowWidth = window.innerWidth
const step = windowWidth / 2000

const Player: React.FunctionComponent = () => {
    const { socket } = React.useContext(SocketContext)

    React.useEffect(() => {
        window.setInterval(resetCounter, 500)

        function resetCounter() {
            if (count === 0) {
                speed = 1
            } else {
                speed = count / 10
            }

            count = 0
        }
    }, [])

    socket?.on('response', (data: IResponse) => {
        console.log('Got response')
        if (data.type === 'game1/runForward') {
            movePlayer()
            count++
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
            const newPos = d.offsetTop + step * speed
            d.style.top = newPos + 'px'
        } else {
            const newPos = d.offsetLeft + step * speed
            d.style.left = newPos + 'px'
        }
    }
}
