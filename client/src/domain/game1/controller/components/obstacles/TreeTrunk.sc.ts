import { TouchApp } from '@material-ui/icons';
import styled, { css, keyframes } from 'styled-components';

import { SkipButton } from '../../../../../components/controller/SkipButton.sc';
import { Orientation } from './TreeTrunk';

const slideVertical = keyframes`
    0% { 
        transform: translateY(-200px);
        opacity: 1;
    }
    100% { 
        transform: translateY(200px);
        opacity: 0;  
    }
`;

const slideHorizontal = keyframes`
    0%{ 
        transform: translateX(-100px);
        opacity: 1;
    }
    100% { 
        transform: translateX(100px);
        opacity: 0;  
    }
`;

const slideIn = keyframes`
    0% {
        transform: scale(0.2);
    }

    100% {
        transform: scale(1);
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
    animation-duration: 0.5s;
    animation-iteration-count: 1;
    animation-name: ${slideIn};
    transform-origin: top;
    transition: 1s;
    animation-timing-function: ease;
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
        animation-duration: 2s;
        animation-iteration-count: 3;
        transform-origin: bottom;
        animation-name: ${({ orientation }) => (orientation === 'vertical' ? slideVertical : slideHorizontal)};
        opacity: 0;
    }
`;

export const StyledSkipButton = styled(SkipButton)`
    && {
        position: absolute;
        bottom: 30px;
    }
`;

export const ProgressBarContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    height: 20%;
`;

interface DragItemProps {
    orientation: Orientation;
    failed: boolean;
}

export const DragItem = styled.div<DragItemProps>`
    width: 20px;
    height: 20px;
    background-color: ${({ failed }) => (failed ? 'red' : 'rgb(245, 230, 99)')};
    border: 10px solid rgba(136, 136, 136, 0.5);
    border-radius: 50%;
    touch-action: none;
    user-select: none;
    position: absolute;
    left: ${({ orientation }) => (orientation === 'horizontal' ? 0 : '30px')};
    top: ${({ orientation }) => (orientation === 'vertical' ? 0 : '30px')};
    opacity: 0;
`;
