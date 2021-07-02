import { LinearProgress } from '@material-ui/core';
import styled from 'styled-components';

export const LinearProgressContainer = styled.div`
    width: 80%;
    border: 3px solid ${({ theme }) => theme.colors.grey};
    margin: 20px 0;
    z-index: 3;
`;

export const StyledLinearProgress = styled(LinearProgress)`
    && {
        height: 30px;
        margin: 3px;
        background-color: ${({ theme }) => theme.colors.lightgrey};

        .MuiLinearProgress-barColorPrimary {
            background: linear-gradient(
                180deg,
                ${({ theme }) => theme.colors.progressBarExtremeLightGreen} 0,
                ${({ theme }) => theme.colors.progressBarExtremeLightGreen} 10%,
                ${({ theme }) => theme.colors.progressBarLightGreen} 10%,
                ${({ theme }) => theme.colors.progressBarLightGreen} 50%,
                ${({ theme }) => theme.colors.progressBarGreen} 50%,
                ${({ theme }) => theme.colors.progressBarGreen} 100%
            );
        }
    }
`;
