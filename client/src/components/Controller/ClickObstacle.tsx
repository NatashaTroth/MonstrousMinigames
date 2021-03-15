import * as React from 'react'
import { ObstacleItem, ObstacleContainer, StyledObstacleImage, ObstacleInstructions } from './ClickObstacle.sc'
import { OBSTACLES } from '../../utils/constants'
import { SocketContext } from '../../contexts/SocketContextProvider'
import wood from '../../images/wood.png'
import { useHistory } from 'react-router-dom'
import { PlayerContext } from '../../contexts/PlayerContextProvider'

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
