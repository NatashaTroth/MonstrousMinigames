import styled, { keyframes } from 'styled-components';

import { lightBlue, orange } from '../../../utils/colors';

export const swing = keyframes`
    0% {
        transform: rotate(0);
    }
    25% {
        transform: rotate(-12deg);
    }
    50% {
        transform: rotate(8deg);
    }
    75% {
        transform: rotate(-4deg);
    }
    100% {
         transform: rotate(0);
    }
`;

export const eyeRollLeft = keyframes`
    0% {
        transform: rotate(720deg);
    }

    100% {
         transform: rotate(0);
    }
`;

export const eyeRollRight = keyframes`
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(720deg);
    }
`;

export const ObstacleContainer = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${lightBlue};
    display: flex;
    align-items: center;
    flex-direction: column;

    img {
        user-select: none;
        pointer-events: none;
    }
`;

export const ObstacleInstructions = styled.div`
    border: 5px solid ${orange};
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    color: ${orange};
    font-weight: 700;
    display: flex;
    width: 80%;
    font-size: 20px;
    flex-direction: column;
    text-align: center;
    box-shadow: 8px 8px 0 #888;
    border-radius: 4px;
    margin-top: 50px;
    margin-bottom: 20px;
    z-index: 3;
`;

export const ObstacleContent = styled.div`
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;

    .swing {
        animation-duration: 3s;
        animation-iteration-count: 1;
        animation-name: ${swing};
        transform-origin: top;
        transition: 1s;
        animation-timing-function: ease;

        .eyeRight {
            animation-duration: 2s;
            animation-delay: 2s;
            animation-iteration-count: 1;
            animation-name: ${eyeRollRight};
            transition: 1s;
            animation-timing-function: ease;
            transform-origin: 90.1px 618.7px;
        }

        .eyeLeft {
            animation-duration: 2s;
            animation-delay: 2s;
            animation-iteration-count: 1;
            animation-name: ${eyeRollLeft};
            transition: 1s;
            animation-timing-function: ease;
            transform-origin: 68.8px 613.5px;
        }
    }
`;
