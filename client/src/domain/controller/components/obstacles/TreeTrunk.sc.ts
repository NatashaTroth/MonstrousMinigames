import { TouchApp } from '@material-ui/icons';
import styled, { css, keyframes } from 'styled-components';

import { SkipButton } from '../../../../components/common/SkipButton.sc';
import { Orientation } from './TreeTrunk';

const slideVertical = keyframes`
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

const slideHorizontal = keyframes`
    0%, 33% { 
        transform: translateX(-100);
          opacity: 1;
    }
    16% {
        transform: translateX(100px); 
          opacity: 1;
    }
    33%{
       transform: translateX(-100px);
         opacity: 1;  
    }
    49%{
       transform: translateX(100px);  
         opacity: 1;
    }
    66%{
       transform: translateX(-100px);  
         opacity: 1;
    }
    82%{
       transform: translateX(100px);  
       opacity: 1;
    }
    100% { 
        transform: translateX(100px);
        opacity: 0;  
    }
`;

interface Props {
    orientation: Orientation;
}

export const ObstacleItem = styled.div<Props>`
    ${({ orientation }) =>
        orientation === 'horizontal'
            ? css`
                  transform: rotate(32deg);
                  display: flex;
                  width: 80%;
              `
            : css`
                  transform: rotate(325deg);
                  display: flex;
                  width: 80%;
              `}
`;

export const StyledObstacleImage = styled.img`
    width: 100%;
`;

export const TouchContainer = styled.div<Props>`
    ${({ orientation }) =>
        orientation === 'horizontal'
            ? css`
                  position: absolute;
                  height: 100px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 80%;
              `
            : css`
                  position: absolute;
                  height: 60%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 100px;
              `}
`;

export const Line = styled.div<Props>`
    ${({ orientation }) =>
        orientation === 'horizontal'
            ? css`
                  width: 100%;
                  position: absolute;
                  border-top: 8px dashed white;
              `
            : css`
                  height: 100%;
                  position: absolute;
                  border-left: 8px dashed white;
              `}
`;

export const StyledTouchAppIcon = styled(TouchApp)<Props>`
    && {
        margin-top: 20px;
        z-index: 2;
        width: 50px;
        height: 50px;
        color: white;
        animation-duration: 6s;
        animation-iteration-count: 1;
        transform-origin: bottom;
        animation-name: ${({ orientation }) => (orientation === 'vertical' ? slideVertical : slideHorizontal)};
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
