import * as React from 'react'
import { IMovePlayer } from './Character'
import { ObstacleButton } from './ClickObstacle.sc'

interface IClickObstacle {
    setObstacle: (value: boolean) => void
    setObstacleRemoved: (value: boolean) => void
    movePlayer: (val: IMovePlayer) => void
}

const ClickObstacle: React.FunctionComponent<IClickObstacle> = ({ setObstacle, setObstacleRemoved, movePlayer }) => {
    return (
        <ObstacleButton
            onClick={() => {
                setObstacle(false)
                setObstacleRemoved(true)
                movePlayer({ setObstacle, obstacleRemoved: true, obstacle: false })
                // eslint-disable-next-line no-console
                console.log('OBSTACLE REMOVED')
            }}
        >
            Click me!!!!
        </ObstacleButton>
    )
}

export default ClickObstacle
