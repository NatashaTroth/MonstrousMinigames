import Hammer from 'hammerjs';
import * as React from 'react';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import wood from '../../../images/wood.png';
import { OBSTACLES, TOUCHEVENT } from '../../../utils/constants';
import LinearProgressBar from '../LinearProgressBar';
import {
    Line, ObstacleContainer, ObstacleInstructions, ObstacleItem, StyledObstacleImage, TouchContainer
} from './TreeTrunk.sc';

const MAX = 50
const Treshold = 2
let counter = 0
interface IClickObstacle {
    setObstacle: (value: undefined | OBSTACLES) => void
}

const TreeTrunk: React.FunctionComponent<IClickObstacle> = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext)
    const { setObstacle } = React.useContext(PlayerContext)
    const [progress, setProgress] = React.useState(0)

    React.useEffect(() => {
        const touchContainer = document.getElementById('touchContainer')
        let touchEvent: null | string = null
        let send = true

        if (touchContainer) {
            const hammertime = touchContainer && new Hammer(touchContainer)

            hammertime?.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL })

            if (counter <= MAX + Treshold) {
                hammertime?.on('panleft panright', e => {
                    handleTouchEvent(e.type)
                })
            } else {
                hammertime?.off('panleft panright')
            }
        }

        function handleTouchEvent(event: string) {
            if (counter >= MAX + Treshold && send) {
                send = false
                solveObstacle()
                return
            }

            if (!touchEvent) {
                touchEvent = event
            } else {
                if (
                    (event === TOUCHEVENT.panLeft && touchEvent === TOUCHEVENT.panRight) ||
                    (event === TOUCHEVENT.panRight && touchEvent === TOUCHEVENT.panLeft)
                ) {
                    ++counter
                    setProgress(counter)
                    touchEvent = event
                }
            }
        }

        const solveObstacle = (): void => {
            controllerSocket?.emit('message', { type: 'game1/obstacleSolved' })
            setObstacle(undefined)
        }
    }, [controllerSocket, progress, setObstacle])

    return (
        <ObstacleContainer>
            <ObstacleInstructions>Saw along the line to cut it!</ObstacleInstructions>
            <LinearProgressBar progress={progress} />
            <TouchContainer id="touchContainer">
                <ObstacleItem>
                    <StyledObstacleImage src={wood} />
                </ObstacleItem>
                <Line />
            </TouchContainer>
        </ObstacleContainer>
    )
}

export default TreeTrunk
