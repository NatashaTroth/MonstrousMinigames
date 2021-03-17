import * as React from 'react'

import woodFront from '../../images/woodFront.png'
import { ObstacleContainer, StyledObstacle, StyledObstacleHint, StyledObstacleImage } from './Obstacle.sc'

interface IObstacle {
    posX: number
    player: number
    playerAtObstacle: boolean
}

const Obstacle: React.FunctionComponent<IObstacle> = ({ posX, player, playerAtObstacle }) => {
    return (
        <ObstacleContainer>
            {playerAtObstacle && <StyledObstacleHint className="bounce" posX={posX} player={player} />}
            <StyledObstacle posX={posX} player={player}>
                <StyledObstacleImage src={woodFront} />
            </StyledObstacle>
        </ObstacleContainer>
    )
}

export default Obstacle
