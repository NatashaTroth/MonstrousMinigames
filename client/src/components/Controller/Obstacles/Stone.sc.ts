import { Typography } from '@material-ui/core';
import styled, { keyframes } from 'styled-components';

import { ObstacleContainer } from './ObstaclStyles.sc';

const ray_anim = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
         transform: rotate(360deg);
    }
`;

export const StyledTypography = styled(Typography)`
    && {
        color: white;
    }
`;

export const StyledStone = styled.div`
    display: flex;
    width: 100%;
    height: 70%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
`;

export const Sun = styled.div`
    position: absolute;
    top: 150px;
    left: 0;
    right: 0;
    margin: auto;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: white;
    opacity: 0.9;
    box-shadow: 0px 0px 40px 15px white;
`;

export const RayBox = styled.div`
    position: absolute;
    margin: auto;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;
    width: 70px;
    -webkit-animation: ${ray_anim} 30s linear infinite;
    animation: ${ray_anim} 30s linear infinite;
`;

export const Ray = styled.div`
    background: -webkit-linear-gradient(
        top,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.8) 50%,
        rgba(255, 255, 255, 0) 100%
    );
    background: linear-gradient(
        top,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.8) 50%,
        rgba(255, 255, 255, 0) 100%
    );
    margin-left: 10px;
    border-radius: 80% 80% 0 0;
    position: absolute;
    opacity: 0.1;
`;

export const Ray1 = styled(Ray)`
    height: 170px;
    width: 30px;
    transform: rotate(180deg);
    top: -175px;
    left: 15px;
`;

export const Ray2 = styled(Ray)`
    height: 100px;
    width: 8px;
    transform: rotate(220deg);
    top: -90px;
    left: 75px;
`;

export const Ray3 = styled(Ray)`
    height: 170px;
    width: 50px;
    transform: rotate(250deg);
    top: -80px;
    left: 100px;
`;

export const Ray4 = styled(Ray)`
    height: 120px;
    width: 14px;
    transform: rotate(305deg);
    top: 30px;
    left: 100px;
`;

export const Ray5 = styled(Ray)`
    height: 140px;
    width: 30px;
    transform: rotate(-15deg);
    top: 60px;
    left: 40px;
`;

export const Ray6 = styled(Ray)`
    height: 90px;
    width: 50px;
    transform: rotate(30deg);
    top: 60px;
    left: -40px;
`;

export const Ray7 = styled(Ray)`
    height: 180px;
    width: 10px;
    transform: rotate(70deg);
    top: -35px;
    left: -40px;
`;

export const Ray8 = styled(Ray)`
    height: 120px;
    width: 30px;
    transform: rotate(100deg);
    top: -45px;
    left: -90px;
`;

export const Ray9 = styled(Ray)`
    height: 80px;
    width: 10px;
    transform: rotate(120deg);
    top: -65px;
    left: -60px;
`;

export const Ray10 = styled(Ray)`
    height: 190px;
    width: 23px;
    transform: rotate(150deg);
    top: -185px;
    left: -60px;
`;

interface StoneContainer {
    pebble: boolean;
}

export const StoneContainer = styled(ObstacleContainer)<StoneContainer>`
    justify-content: ${({ pebble }) => (pebble ? 'flex-start' : 'center')};
`;

export const StyledStoneImage = styled.img`
    width: 80%;
`;

export const StyledPebbleImage = styled.img`
    width: 40%;
    z-index: 2;
    top: 110px;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
`;

export const PebbleContainer = styled(ObstacleContainer)`
    height: 500px;
    display: block;
    width: 100%;
`;

interface Props {
    characterNumber: number;
}

export const PlayerButtonContainer = styled.div<Props>`
    && {
        margin-bottom: 20px;
        background-color: ${({ characterNumber, theme }) => theme.colors.characterColors[characterNumber]};
        color: black;
        cursor: pointer;
        padding: 10px;
        font-weight: 700;
        font-size: 22px;
        border-radius: 10px;
        min-width: 200px;
    }
`;
