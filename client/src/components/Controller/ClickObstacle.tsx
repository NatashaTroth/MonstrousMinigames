import * as React from 'react'
import { ObstacleButton } from './ClickObstacle.sc'
import { OBSTACLES } from '../../utils/constants'

interface IClickObstacle {
    setObstacle: (value: undefined | OBSTACLES) => void
}

const ClickObstacle: React.FunctionComponent<IClickObstacle> = ({ setObstacle }) => {
    return (
        <ObstacleButton
            onClick={() => {
                setObstacle(undefined)
                // eslint-disable-next-line no-console
                console.log('OBSTACLE REMOVED')
            }}
        >
            Click me!!!!
        </ObstacleButton>
    )
}

export default ClickObstacle
