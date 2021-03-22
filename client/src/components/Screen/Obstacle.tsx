import * as React from 'react'

import woodFront from '../../images/woodFront.png'
import { ObstacleContainer, StyledObstacle, StyledObstacleHint, StyledObstacleImage } from './Obstacle.sc'

interface IObstacle {
    posx: number
    player: number
    playerAtObstacle: boolean
}

const Obstacle: React.FunctionComponent<IObstacle> = ({ posx, player, playerAtObstacle }) => {
    return (
        <ObstacleContainer>
            {playerAtObstacle && <StyledObstacleHint className="bounce" posx={posx} player={player} />}
            <StyledObstacle posx={posx} player={player}>
                <StyledObstacleImage src={woodFront} />
            </StyledObstacle>
        </ObstacleContainer>
    )
}

export default Obstacle
