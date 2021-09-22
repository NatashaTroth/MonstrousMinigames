import styled, { keyframes } from "styled-components";

import forest from "../../../../images/ui/forest_mobile.svg";

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

const fallOff = keyframes`
    100% {
        transform: translateY(800px);
    }
`;

export const ObstacleContainer = styled.div`
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
    background-image: url(${forest});
    display: flex;
    align-items: center;
    flex-direction: column;

    img {
        user-select: none;
        pointer-events: none;
    }
`;

export const ObstacleContent = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    z-index: 2;
    height: 60%;

    .swing {
        animation-duration: 3s;
        animation-iteration-count: infinite;
        animation-name: ${swing};
        transform-origin: top;
        transition: 1s;
        animation-timing-function: ease;

        .eyeRight {
            animation-duration: 2s;
            animation-delay: 2s;
            animation-iteration-count: infinite;
            animation-name: ${eyeRollRight};
            transition: 1s;
            animation-timing-function: ease;
            transform-origin: 90.1px 618.7px;
        }

        .eyeLeft {
            animation-duration: 2s;
            animation-delay: 2s;
            animation-iteration-count: infinite;
            animation-name: ${eyeRollLeft};
            transition: 1s;
            animation-timing-function: ease;
            transform-origin: 68.8px 613.5px;
        }
    }

    .fallOff {
        animation-duration: 1s;
        animation-iteration-count: 1;
        animation-name: ${fallOff};
        transform-origin: bottom;
        transition: 1s;
        animation-timing-function: ease;
        animation-fill-mode: forwards;
    }
`;
