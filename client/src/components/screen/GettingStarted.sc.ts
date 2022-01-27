import { Typography } from '@material-ui/core';
import styled from 'styled-components';

import { OrangeBase } from '../common/CommonStyles.sc';

export const DialogContent = styled(OrangeBase)`
    padding: 40px 100px;
    border-radius: 10px;
`;

export const StyledTypography = styled(Typography)`
    && {
        margin-bottom: 20px;
        letter-spacing: 1px;
        line-height: 1.8;
    }
`;
