import { TouchApp } from '@material-ui/icons';
import Particles from 'react-particles-js';
import styled, { keyframes } from 'styled-components';

import { grey } from '../../../utils/colors';
import { ObstacleContainer } from './ObstaclStyles.sc';

const slide = keyframes`
    0%, 33% { 
        transform: translateX(-200);
          opacity: 1;
    }
    16% {
        transform: translateX(200px); 
          opacity: 1;
    }
    33%{
       transform: translateX(-200px);
         opacity: 1;  
    }
    49%{
       transform: translateX(200px);  
         opacity: 1;
    }
    66%{
       transform: translateX(-200px);  
         opacity: 1;
    }
    82%{
       transform: translateX(200px);  
       opacity: 1;
    }
    100% { 
        transform: translateX(200px);
        opacity: 0;  
    }
`;

export const ObstacleItem = styled.div`
    transform: rotate(275deg);
`;
export const StyledObstacleImage = styled.img`
    width: 80%;
`;

export const TouchContainer = styled.div`
    position: absolute;
    height: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80%;
`;

export const Line = styled.div`
    width: 80%;
    position: absolute;
    border-top: 8px dashed white;
`;

export const StyledTouchAppIcon = styled(TouchApp)`
    && {
        margin-top: 20px;
        z-index: 2;
        width: 50px;
        height: 50px;
        color: ${grey};
        animation-duration: 6s;
        animation-iteration-count: 1;
        transform-origin: bottom;
        animation-name: ${slide};
        opacity: 0;
    }
`;

export const SkipButton = styled.div`
    z-index: 2;
`;

export const StyledParticles = styled(Particles)`
    position: absolute;
`;

export const TreeTrunkContainer = styled(ObstacleContainer)`
    && {
        justify-content: center;
    }
`;
