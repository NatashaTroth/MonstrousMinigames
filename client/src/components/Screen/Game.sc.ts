import { Dialog } from '@material-ui/core';
import { Pause, PlayArrow, Stop } from '@material-ui/icons';
import styled, { keyframes } from 'styled-components';

import forest from '../../images/forest.png';
import { orange } from '../../utils/colors';

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
    background-size: cover;
    background-repeat-y: repeat;
    top: 0;
    background-position: bottom;
    background-image: url(${forest});
`;

export const ContainerTimer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const CountdownRenderer = styled.p`
    font-size: 8em;
    font-weight: 900;
    color: ${orange};
`;

export const Go = styled.p`
    font-size: 200px;
    font-weight: 900;
    color: ${orange};
    -webkit-animation: fadeInOut 6s;
    animation: ${fadeOut} 2s;
    opacity: 0;
    position: absolute;
    left: calc(50% - 140px);
    top: 18%;
`;

export const ControlBar = styled.div`
    display: flex;
    width: 100%;
    margin-right: 10px;
    justify-content: flex-end;
`;

export const IconContainer = styled.div`
    margin-right: 20px;
    margin-top: 10px;
`;

export const PauseIcon = styled(Pause)`
    width: 20px;
    height: 20px;
    color: white;
`;

export const StopIcon = styled(Stop)`
    width: 20px;
    height: 20px;
    color: white;
`;

export const PlayIcon = styled(PlayArrow)`
    width: 20px;
    height: 20px;
    color: black;
`;

export const StyledDialog = styled(Dialog)`
    && {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export const DialogContent = styled.div`
    && {
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
`;
