import { darken, Grid } from '@material-ui/core';
import styled, { css } from 'styled-components';

export const LeaderboardGrid = styled(Grid)`
    && {
        flex-direction: column;
    }
`;

interface RowProps {
    header?: boolean;
    index?: number;
}
export const LeaderboardRow = styled.div<RowProps>`
    display: flex;
    padding: 25px 0;

    ${({ header = false, theme }) =>
        header &&
        css`
            font-weight: 700;
            font-size: 18px;
            color: white;
            background-color: ${darken(theme.palette.secondary.main, 0.2)};
        `}

    ${({ index, theme }) =>
        index &&
        index % 2 !== 0 &&
        css`
            background-color: ${darken(theme.palette.secondary.main, 0.1)};
        `}
`;
