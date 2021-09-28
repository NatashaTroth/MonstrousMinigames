import { darken } from '@material-ui/core';
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: space-around;
`;

export const ShakeIt = styled.img`
    display: flex;
    width: 80%;
`;

export const Countdown = styled.div`
    color: ${({ theme }) => theme.palette.secondary.main};
    font-weight: 700;
    font-size: 70px;
`;

export const StyledPebbleImage = styled.img`
    width: 100%;
`;

const boxShadowDepth = 7;

export const PebbleButton = styled.div`
    width: 20%;
    padding: 20px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.playerName};
    box-shadow: ${({ theme }) =>
        `calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0 ${darken(theme.colors.playerName, 0.5)}}`};

    &:hover {
        box-shadow: calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0
            ${({ theme }) => darken(theme.colors.playerName, 0.5)};
        background: ${({ theme }) => theme.colors.playerName};
    }

    &:active {
        transform: translateY(4px);
        box-shadow: calc(${boxShadowDepth} * 1px - 4px) calc(${boxShadowDepth} * 1px - 4px) 0
            ${({ theme }) => darken(theme.colors.playerName, 0.5)};
        background: ${({ theme }) => theme.colors.playerName};
    }
`;

export const PebbleContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`;

export const PebbleInstructions = styled.div`
    color: white;
    margin-bottom: 30px;
`;

export const Arrow = styled.img`
    width: 80px;
    margin-left: 80px;
    margin-top: -25px;
    position: absolute;
`;
