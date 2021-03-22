import Hammer from 'hammerjs'
import * as React from 'react'

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider'
import { PlayerContext } from '../../contexts/PlayerContextProvider'
import wood from '../../images/wood.png'
import { OBSTACLES, TOUCHEVENT } from '../../utils/constants'
import {
    Line,
    ObstacleContainer,
    ObstacleInstructions,
    ObstacleItem,
    StyledObstacleImage,
    TouchContainer,
} from './ClickObstacle.sc'
import LinearProgressBar from './LinearProgressBar'

interface IClickObstacle {
    setObstacle: (value: undefined | OBSTACLES) => void
}

const ClickObstacle: React.FunctionComponent<IClickObstacle> = () => {
    const touchContainer = document.getElementById('touchContainer')
    const { controllerSocket } = React.useContext(ControllerSocketContext)
    const { setObstacle } = React.useContext(PlayerContext)
    const [counter, setCounter] = React.useState(0)
    let helper = 0
    let touchEvent: null | string = null

    if (touchContainer && helper < 40) {
        const hammertime = new Hammer(touchContainer)
        hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL })
        hammertime.on('panleft panright', e => {
            // eslint-disable-next-line no-console
            console.log(e)
            handleTouchEvent(e.type)
        })
    }

    function handleTouchEvent(event: string) {
        if (helper === 40) {
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
                touchEvent = event
                setCounter(helper + 1)
                ++helper
            }
        }
    }

    function solveObstacle() {
        // eslint-disable-next-line no-console
        console.log('solved')
        controllerSocket?.emit('message', { type: 'game1/obstacleSolved' })
        setObstacle(undefined)
    }

    return (
        <ObstacleContainer>
            <ObstacleInstructions>Saw along the line to cut it!</ObstacleInstructions>
            <LinearProgressBar progress={counter} />
            <TouchContainer id="touchContainer">
                <ObstacleItem>
                    <StyledObstacleImage src={wood} />
                </ObstacleItem>
                <Line />
            </TouchContainer>
        </ObstacleContainer>
    )
}

export default ClickObstacle
