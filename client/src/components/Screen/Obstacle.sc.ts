import { Error } from '@material-ui/icons';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
    0%   { transform: scale(1,1)      translateY(0); }
    10%  { transform: scale(1.1,.9)   translateY(0); }
    30%  { transform: scale(.9,1.1)   translateY(-60px); }
    50%  { transform: scale(1.05,.95) translateY(0); }
    57%  { transform: scale(1,1)      translateY(-7px); }
    64%  { transform: scale(1,1)      translateY(0); }
    100% { transform: scale(1,1)      translateY(0); }
`;

interface IObstacleProps {
    posx: number;
    player: number;
}

export const ObstacleContainer = styled.div`
    .bounce {
        animation-name: ${bounce};
        animation-timing-function: ease;
    }
`;

export const StyledObstacle = styled.div<IObstacleProps>`
    height: 50px;
    width: 50px;
    position: absolute;
    z-index: 2;
    border-radius: 50%;
    left: ${({ posx }) => posx + 70}px;
    top: ${({ player }) => 160 + player * 200}px;
`;

export const StyledObstacleImage = styled.img`
    width: 100%;
`;

export const StyledObstacleHint = styled(Error)<IObstacleProps>`
    && {
        height: 50px;
        width: 50px;
        position: absolute;
        color: red;
        z-index: 2;
        border-radius: 50%;
        left: ${({ posx }) => posx + 70}px;
        top: ${({ player }) => 100 + player * 200}px;
        animation-duration: 2s;
        animation-iteration-count: infinite;
        transform-origin: bottom;
    }
`;
