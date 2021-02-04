import * as React from 'react'
import { StyledObstacle } from './Obstacle.sc'

interface IObstacle {
    posX: number
    player: number
}

const Obstacle: React.FunctionComponent<IObstacle> = ({ posX, player }) => {
    return <StyledObstacle posX={posX} player={player} />
}

export default Obstacle
