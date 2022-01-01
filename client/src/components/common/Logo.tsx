import { Typography } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';

const StyledTypography = styled(Typography)`
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

const Logo: React.FunctionComponent = () => (
    <div>
        <StyledTypography>Monstrous</StyledTypography>
        <StyledTypography>Minigames</StyledTypography>
    </div>
);

export default Logo;
