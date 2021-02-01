/* eslint-disable no-console */
import * as React from 'react'
import { Container, ObstacleButton, Player } from './Character.sc'

const windowWidth = window.innerWidth
let counter = 0

const Character: React.FunctionComponent = () => {
    const [permissionGranted, setPermissionGranted] = React.useState(false)
    const [obstacle, setObstacle] = React.useState(false)
    const [obstacleRemoved, setObstacleRemoved] = React.useState(false)

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
                    console.log(obstacleRemoved)
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

            {obstacle && (
                <ObstacleButton
                    onClick={() => {
                        setObstacle(false)
                        setObstacleRemoved(true)
                        movePlayer({ setObstacle, obstacleRemoved: true, obstacle: false })
                        console.log('OBSTACLE REMOVED')
                    }}
                >
                    Click me!!!!
                </ObstacleButton>
            )}
            <Container inVisible={obstacle}>
                <Player id="player">Player</Player>
            </Container>
        </>
    )
}

export default Character

interface IMovePlayer {
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

export async function ClickRequestDeviceMotion() {
    let permission = false

    // iOS: Requests permission for device orientation
    if (window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function') {
        const permissionReq = await window.DeviceMotionEvent.requestPermission()
        if (permissionReq === 'granted') {
            permission = true
        }
    } else {
        // every OS than Safari
        permission = true
    }

    return permission
}
