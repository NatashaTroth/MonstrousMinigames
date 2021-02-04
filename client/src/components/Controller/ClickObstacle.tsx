import * as React from 'react'
import { ObstacleItem, ObstacleContainer, StyledObstacleImage, ObstacleInstructions } from './ClickObstacle.sc'
import { OBSTACLES } from '../../utils/constants'
import { SocketContext } from '../../contexts/SocketContextProvider'
import wood from '../../images/wood.png'

interface IClickObstacle {
    setObstacle: (value: undefined | OBSTACLES) => void
}

const ClickObstacle: React.FunctionComponent<IClickObstacle> = ({ setObstacle }) => {
    const { controllerSocket } = React.useContext(SocketContext)

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
