import * as React from 'react'

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider'
import { PlayerContext } from '../../contexts/PlayerContextProvider'
import wood from '../../images/wood.png'
import { OBSTACLES } from '../../utils/constants'
import { ObstacleContainer, ObstacleInstructions, ObstacleItem, StyledObstacleImage } from './ClickObstacle.sc'

interface IClickObstacle {
    setObstacle: (value: undefined | OBSTACLES) => void
}

const ClickObstacle: React.FunctionComponent<IClickObstacle> = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext)
    const { setObstacle } = React.useContext(PlayerContext)

    function solveObstacle() {
        controllerSocket?.emit('message', { type: 'game1/obstacleSolved' })
        setObstacle(undefined)
    }
    return (
        <ObstacleContainer>
            <ObstacleInstructions>
                Oh no! A tree trunk is blocking your way. Click on it to remove it!
            </ObstacleInstructions>

            <ObstacleItem onClick={solveObstacle}>
                <StyledObstacleImage src={wood} />
            </ObstacleItem>
        </ObstacleContainer>
    )
}

export default ClickObstacle
