import { Dialog } from '@material-ui/core';
import ScreenRotationIcon from '@material-ui/icons/ScreenRotation';
import styled from 'styled-components';

import { orange } from '../../utils/colors';

export const StyledShakeInstruction = styled.div`
    border: 5px solid ${orange};
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    color: ${orange};
    font-weight: 700;
    display: flex;
    width: 100%;
    font-size: 25px;
    flex-direction: column;
    text-align: center;
    box-shadow: 8px 8px 0 #888;
    border-radius: 4px;
`;
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const StyledRotationIcon = styled(ScreenRotationIcon)`
    && {
        width: 100px;
        margin-top: -40px;
        height: 100px;
        margin-bottom: 20px;
        color: ${orange};
    }
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
