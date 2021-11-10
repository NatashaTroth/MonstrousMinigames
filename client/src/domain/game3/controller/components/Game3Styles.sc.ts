import { Typography } from '@material-ui/core';
import styled from 'styled-components';

import { StyledFullScreenContainer } from '../../../../components/controller/FullScreenContainer.sc';

export const ScreenContainer = styled(StyledFullScreenContainer)`
    && {
        flex-direction: column;
    }
`;

export const Instructions = styled(Typography)`
    color: ${({ theme }) => theme.palette.primary.main};
    font-size: 24px;
    font-weight: 700;
    font-style: italic;
    margin-bottom: 30px;
    padding: 0 20px;
`;
