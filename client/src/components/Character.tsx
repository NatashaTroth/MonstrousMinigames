/* eslint-disable no-console */
import * as React from 'react'
import { Socket } from 'socket.io-client'
import { SocketContext } from '../contexts/SocketContextProvider'
import { ClickRequestDeviceMotion } from '../utils/permissions'
import { Container, Player } from './Character.sc'
import ClickObstacle from './ClickObstacle'

const windowWidth = window.innerWidth
let counter = 0

const Character: React.FunctionComponent = () => {
    const [permissionGranted, setPermissionGranted] = React.useState(false)
    const [obstacle, setObstacle] = React.useState(false)
    const [obstacleRemoved, setObstacleRemoved] = React.useState(false)

    const { socket } = React.useContext(SocketContext)

    const player = document.getElementById('player')

    if (permissionGranted) {
        window.addEventListener(
            'devicemotion',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (event: any) => {
                if (
                    event?.acceleration?.x &&
                    (event.acceleration.x < -2 || event.acceleration.x > 2) &&
                    player &&
                    !obstacle
                ) {
                    sendMessage(socket)
                    movePlayer({ setObstacle, obstacleRemoved, obstacle })
                    // console.log('RUN - DeviceMotion: ' + event.acceleration.x + ' m/s2')
                } else {
                    // console.log('STOP')
                }
            }
        )
    }

    return (
        <>
            {!permissionGranted && (
                <button onClick={async () => setPermissionGranted(await ClickRequestDeviceMotion())}>Start Game</button>
            )}
            <button
                onClick={() => {
                    sendMessage(socket)
                    movePlayer({ setObstacle, obstacleRemoved, obstacle })
                }}
            >
                Move
            </button>
            {obstacle && (
                <ClickObstacle
                    setObstacle={setObstacle}
                    setObstacleRemoved={setObstacleRemoved}
                    movePlayer={movePlayer}
                />
            )}
            <Container inVisible={obstacle}>
                <Player id="player">Player</Player>
            </Container>
        </>
    )
}

export default Character

function sendMessage(socket: Socket | undefined) {
    socket?.emit('message', { type: 'game1/runForward', roomId: '', userId: '' })
}

export interface IMovePlayer {
    setObstacle: (val: boolean) => void
    obstacleRemoved: boolean
    obstacle: boolean
}

function movePlayer({ setObstacle, obstacleRemoved, obstacle }: IMovePlayer) {
    const d = document.getElementById('player')

    if (d) {
        if (!obstacleRemoved && d.offsetLeft >= windowWidth / 2 && counter === 0) {
            console.log('OBSTACLE')
            setObstacle(true)
            counter++
        } else if (!obstacle) {
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
}
