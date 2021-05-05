import * as React from 'react';

import spider from '../../images/spider.svg';
import woodFront from '../../images/woodFront.png';
import { Obstacles } from '../../utils/constants';
import { ObstacleContainer, StyledObstacle, StyledObstacleHint, StyledObstacleImage } from './Obstacle.sc';

interface IObstacle {
    posx: number;
    player: number;
    playerAtObstacle: boolean;
    type: Obstacles;
}

const Obstacle: React.FunctionComponent<IObstacle> = ({ posx, player, playerAtObstacle, type }) => {
    const image = type === Obstacles.treeStump ? woodFront : spider;

    return (
        <ObstacleContainer>
            {playerAtObstacle && <StyledObstacleHint className="bounce" posx={posx} player={player} type={type} />}
            <StyledObstacle posx={posx} player={player} type={type}>
                <StyledObstacleImage src={image} />
            </StyledObstacle>
        </ObstacleContainer>
    );
};

export default Obstacle;
