import * as React from 'react'

import woodFront from '../../images/woodFront.png'
import { StyledObstacle, StyledObstacleImage } from './Obstacle.sc'

interface IObstacle {
    posX: number
    player: number
}

const Obstacle: React.FunctionComponent<IObstacle> = ({ posX, player }) => {
    return (
        <StyledObstacle posX={posX} player={player}>
            <StyledObstacleImage src={woodFront} />
        </StyledObstacle>
    )
}

export default Obstacle
