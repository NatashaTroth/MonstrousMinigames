import * as React from 'react'

import wood from '../../images/wood.png'
import { OBSTACLES } from '../../utils/constants'
import {
    Line,
    ObstacleContainer,
    ObstacleInstructions,
    ObstacleItem,
    StyledObstacleImage,
    TouchContainer,
} from './ClickObstacle.sc'

interface IClickObstacle {
    setObstacle: (value: undefined | OBSTACLES) => void
}

const ClickObstacle: React.FunctionComponent<IClickObstacle> = () => {
    // const { controllerSocket } = React.useContext(ControllerSocketContext)
    // const { setObstacle } = React.useContext(PlayerContext)

    // function solveObstacle() {
    //     controllerSocket?.emit('message', { type: 'game1/obstacleSolved' })
    //     setObstacle(undefined)
    // }
    return (
        <ObstacleContainer>
            <ObstacleInstructions>Saw along the line to cut it!</ObstacleInstructions>
            <TouchContainer>
                <ObstacleItem>
                    <StyledObstacleImage src={wood} />
                </ObstacleItem>
                <Line />
            </TouchContainer>
        </ObstacleContainer>
    )
}

export default ClickObstacle
