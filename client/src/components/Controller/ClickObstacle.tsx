import * as React from 'react'
import { ObstacleButton } from './ClickObstacle.sc'

interface IClickObstacle {
    setObstacle: (value: boolean) => void
    setObstacleRemoved: (value: boolean) => void
    sendMessage: () => void
}

const ClickObstacle: React.FunctionComponent<IClickObstacle> = ({ setObstacle, setObstacleRemoved, sendMessage }) => {
    return (
        <ObstacleButton
            onClick={() => {
                setObstacle(false)
                setObstacleRemoved(true)
                sendMessage()
                // eslint-disable-next-line no-console
                console.log('OBSTACLE REMOVED')
            }}
        >
            Click me!!!!
        </ObstacleButton>
    )
}

export default ClickObstacle
