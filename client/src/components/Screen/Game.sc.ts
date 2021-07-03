import styled, { keyframes } from 'styled-components';

import { StyledButtonBase } from '../common/Button.sc';

const fadeOut = keyframes`
    0% {
        opacity: 1;
    }
    40% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}`;

export const Container = styled.div`
    width: 100%;
    position: absolute;
    height: 100%;
    top: 0;
`;

export const Go = styled.p`
    font-size: 200px;
    font-weight: 900;
    color: ${({ theme }) => theme.palette.secondary.main};
    -webkit-animation: fadeInOut 6s;
    animation: ${fadeOut} 2s;
    // opacity: 0;
    position: absolute;
    left: calc(50% - 140px);
    top: 18%;
`;

export const AudioButton = styled(StyledButtonBase)`
    && {
        border-radius: 10px;
        position: absolute;
        right: 20px;
        top: 10px;
    }
`;

export const PauseButton = styled(StyledButtonBase)`
    && {
        border-radius: 10px;
        position: absolute;
        right: 80px;
        top: 10px;
    }
`;
