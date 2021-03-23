import Hammer from 'hammerjs'
import * as React from 'react'
import { useHistory } from 'react-router'

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider'
import { PlayerContext } from '../../../contexts/PlayerContextProvider'
import wood from '../../../images/wood.png'
import { OBSTACLES } from '../../../utils/constants'
import LinearProgressBar from '../LinearProgressBar'
import {
    Line,
    ObstacleContainer,
    ObstacleInstructions,
    ObstacleItem,
    StyledObstacleImage,
    TouchContainer,
} from './TreeTrunk.sc'

const MAX = 10000
const Treshold = 0
let distance = 0
let send = true
interface IClickObstacle {
    setObstacle: (value: undefined | OBSTACLES) => void
}

const TreeTrunk: React.FunctionComponent<IClickObstacle> = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext)
    const { setObstacle } = React.useContext(PlayerContext)
    const [progress, setProgress] = React.useState(0)
    const history = useHistory()

    React.useEffect(() => {
        let touchEvent: null | string = null

        let touchContainer

        let currentDistance = 0

        if (!touchContainer) {
            touchContainer = document.getElementById('touchContainer')
        }

        if (touchContainer) {
            const hammertime = touchContainer && new Hammer(touchContainer)

            hammertime?.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL })

            if (distance <= MAX + Treshold) {
                hammertime?.on('panleft panright', e => {
                    handleTouchEvent({ event: e.type, eventDistance: e.distance })
                })
            } else {
                hammertime?.off('panleft panright')
            }
        }

        function handleTouchEvent({ event, eventDistance }: { event: string; eventDistance: number }) {
            if (distance >= MAX + Treshold && send) {
                send = false
                solveObstacle()
                return
            }

            if (!touchEvent) {
                touchEvent = event
                distance += eventDistance
            } else {
                if (event !== touchEvent) {
                    if (eventDistance > currentDistance) {
                        currentDistance = eventDistance
                    } else {
                        distance += currentDistance
                    }
                    setProgress(distance)
                    touchEvent = event
                }
            }
        }

        const solveObstacle = (): void => {
            controllerSocket?.emit('message', { type: 'game1/obstacleSolved' })
            setTimeout(() => setObstacle(undefined), 100)
        }
    }, [controllerSocket, history, progress, setObstacle])

    return (
        <ObstacleContainer>
            <ObstacleInstructions>Saw along the line to cut it!</ObstacleInstructions>
            <LinearProgressBar progress={progress} MAX={MAX} />
            <TouchContainer>
                <ObstacleItem>
                    <StyledObstacleImage src={wood} />
                </ObstacleItem>
                <Line id="touchContainer" />
            </TouchContainer>
        </ObstacleContainer>
    )
}

export default TreeTrunk
