import { Typography } from '@material-ui/core';
import styled from 'styled-components';

import { secondary } from '../../utils/colors';

export const LobbyScreenContainer = styled.div`
    display: flex;
    height: 100%;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

export const InstructionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 20px;
    justify-content: center;

    .MuiCircularProgress-colorPrimary {
        color: ${secondary};
    }
`;

export const StyledTypography = styled(Typography)`
    && {
        font-weight: 700;
        margin-top: 20px;
        margin-bottom: 50px;
    }
`;
