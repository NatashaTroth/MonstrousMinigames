import { Typography } from '@material-ui/core';
import styled from 'styled-components';

export const LogoContainer = styled.div``;

export const StyledTypography = styled(Typography)`
    && {
        color: white;
        font-weight: 700;
        font-size: 40px;

        @media (min-width: 1060px) {
            font-size: 45px;
        }

        @media (min-width: 2000px) {
            width: 50px;
        }
    }
`;
