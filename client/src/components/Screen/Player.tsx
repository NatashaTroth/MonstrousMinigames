/* eslint-disable no-console */
import * as React from 'react'
import { Container, PlayerCharacter } from './Player.sc'
import { SocketContext } from '../../contexts/SocketContextProvider'
import oliver from '../../images/oliver.png'
import { OBSTACLES } from '../../utils/constants'

let speed = 1
let count = 0

interface IObstacle {
    positionX: number
    type: OBSTACLES
}

interface IPlayerState {
    atObstacle: boolean
    finished: boolean
    id: string
    name: string
    obstacles: IObstacle
    positionX: number
    rank: number
}
interface IGameState {
    // gameState: boolean TODO
    numberOfObstacles: number
    type: 'game1/gameState'
    roomId: string
    trackLength: number
    playersState: IPlayerState[]
}

const windowWidth = window.innerWidth
const step = windowWidth / 2000

const Player: React.FunctionComponent = () => {
    const { screenSocket } = React.useContext(SocketContext)

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

    screenSocket?.on('message', (data: IGameState) => {
        // movePlayer()
        // count++
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
