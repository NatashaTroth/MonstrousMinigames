import * as React from 'react'
import { ObstacleButton } from './ClickObstacle.sc'
import { OBSTACLES } from '../../utils/constants'
import { SocketContext } from '../../contexts/SocketContextProvider'

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
    return <ObstacleButton onClick={solveObstacle}>Click me!!!!</ObstacleButton>
}

export default ClickObstacle
