import { TouchApp } from '@material-ui/icons';
import styled, { keyframes } from 'styled-components';

import { SkipButton } from '../../../../components/common/SkipButton.sc';

const slide = keyframes`
    0%, 33% { 
        transform: translateY(-200);
          opacity: 1;
    }
    16% {
        transform: translateY(200px); 
          opacity: 1;
    }
    33%{
       transform: translateY(-200px);
         opacity: 1;  
    }
    49%{
       transform: translateY(200px);  
         opacity: 1;
    }
    66%{
       transform: translateY(-200px);  
         opacity: 1;
    }
    82%{
       transform: translateY(200px);  
       opacity: 1;
    }
    100% { 
        transform: translateY(200px);
        opacity: 0;  
    }
`;

export const ObstacleItem = styled.div`
    transform: rotate(325deg);
    display: flex;
    width: 80%;
`;

export const StyledObstacleImage = styled.img`
    width: 100%;
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
    height: 80%;
    position: absolute;
    border-left: 8px dashed white;
`;

export const StyledTouchAppIcon = styled(TouchApp)`
    && {
        margin-top: 20px;
        z-index: 2;
        width: 50px;
        height: 50px;
        color: white;
        animation-duration: 6s;
        animation-iteration-count: 1;
        transform-origin: bottom;
        animation-name: ${slide};
        opacity: 0;
    }
`;

export const StyledSkipButton = styled(SkipButton)`
    && {
        position: absolute;
        bottom: -20px;
    }
`;

export const ProgressBarContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    height: 20%;
`;
