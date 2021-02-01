/* eslint-disable no-console */
import * as React from 'react'
import { Player } from './Character.sc'

const windowWidth = window.innerWidth

const Character: React.FunctionComponent = () => {
    const [permissionGranted, setPermissionGranted] = React.useState(false)

    return (
        <>
            {!permissionGranted && (
                <button onClick={() => ClickRequestDeviceMotion(setPermissionGranted)}>Start Game</button>
            )}
            <Player id="player">Player</Player>
            {/* <button onClick={movePlayer}>move</button> */}
        </>
    )
}

export default Character

function movePlayer() {
    const d = document.getElementById('player')

    if (d) {
        if (d.offsetLeft >= windowWidth - d.offsetWidth) {
            d.style.left = Number(windowWidth - d.offsetWidth) + 'px'
            const newPos = d.offsetTop + 2
            d.style.top = newPos + 'px'
        } else {
            const newPos = d.offsetLeft + 2
            d.style.left = newPos + 'px'
        }
    }
}

export function ClickRequestDeviceMotion(setPermissionGranted?: (val: boolean) => void) {
    const d = document.getElementById('player')

    // iOS: Requests permission for device orientation
    if (window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function') {
        window.DeviceMotionEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    window.addEventListener(
                        'devicemotion',
                        (event: DeviceMotionEvent) => {
                            if (
                                event?.acceleration?.x &&
                                (event.acceleration.x < -2 || event.acceleration.x > 2) &&
                                d
                            ) {
                                setPermissionGranted && setPermissionGranted(true)
                                movePlayer()
                                // console.log('RUN - DeviceMotion: ' + event.acceleration.x + ' m/s2')
                            } else {
                                // console.log('STOP')
                            }
                        }
                        // (e: boolean | AddEventListenerOptions | undefined) => {
                        //     throw e;
                        // }
                    )

                    // window.addEventListener('deviceorientation', e => {
                    //     console.log('Deviceorientation: ');
                    //     console.log(e);
                    // })
                } else {
                    // eslint-disable-next-line no-console
                    console.log('DeviceMotion permissions not granted.')
                }
            })
            .catch(e => {
                // eslint-disable-next-line no-console
                console.error(e)
            })
    } else {
        // every OS than Safari
        window.addEventListener(
            'devicemotion',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (event: any) => {
                if (event?.acceleration?.x && (event.acceleration.x < -2 || event.acceleration.x > 2) && d) {
                    movePlayer()
                    // console.log('RUN - DeviceMotion: ' + event.acceleration.x + ' m/s2')
                } else {
                    // console.log('STOP')
                }
            }
            // (e: boolean | AddEventListenerOptions | undefined) => {
            //     throw e;
            // }
        )
    }
}
