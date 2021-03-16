import * as React from 'react'

import { PlayerContext } from '../../contexts/PlayerContextProvider'
import { SocketContext } from '../../contexts/SocketContextProvider'
import wood from '../../images/wood.png'
import { OBSTACLES } from '../../utils/constants'
import { ObstacleContainer, ObstacleInstructions, ObstacleItem, StyledObstacleImage } from './ClickObstacle.sc'

interface IClickObstacle {
    setObstacle: (value: undefined | OBSTACLES) => void
}

const ClickObstacle: React.FunctionComponent<IClickObstacle> = () => {
    const { controllerSocket } = React.useContext(SocketContext)
    const { setObstacle } = React.useContext(PlayerContext)

    function solveObstacle() {
        controllerSocket?.emit('message', { type: 'game1/obstacleSolved' })
        setObstacle(undefined)
        // eslint-disable-next-line no-console
        console.log('OBSTACLE REMOVED')
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
