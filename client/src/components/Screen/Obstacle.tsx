import * as React from 'react'
import { StyledObstacle, StyledObstacleImage } from './Obstacle.sc'
import woodFront from '../../images/woodFront.png'

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
