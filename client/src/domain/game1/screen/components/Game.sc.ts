import styled from 'styled-components';

import { StyledButtonBase } from '../../../../components/common/Button.sc';

export const Container = styled.div`
    width: 100%;
    position: absolute;
    height: 100%;
    top: 0;
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
        right: 140px;
        top: 10px;
    }
`;

export const StopButton = styled(StyledButtonBase)`
    && {
        border-radius: 10px;
        position: absolute;
        right: 80px;
        top: 10px;
    }
`;
