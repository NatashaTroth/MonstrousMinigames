import { darken, Grid } from '@material-ui/core';
import styled, { css } from 'styled-components';

import { Headline } from '../common/FullScreenStyles.sc';

export const LeaderboardGrid = styled(Grid)`
    && {
        flex-direction: column;
        width: 100%;
    }
`;

interface RowProps {
    header?: boolean;
    index?: number;
}
export const LeaderboardRow = styled.div<RowProps>`
    display: flex;
    padding: 15px 0;
    ${({ header = false, theme }) =>
        header &&
        css`
            font-weight: 700;
            font-size: 16px;
            color: white;
            background-color: ${darken(theme.palette.secondary.main, 0.2)};
        `}
    ${({ index, theme }) =>
        index &&
        index % 2 !== 0 &&
        css`
            background-color: ${darken(theme.palette.secondary.main, 0.1)};
        `};
`;

export const LeaderboardWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    height: 100%;
    overflow: scroll;
`;

export const GameHistoryHeadline = styled(Headline)`
    && {
        margin-bottom: 10px;
        color: black;
        font-size: 18px;
        background: #a7bdb1;
        padding: 15px;
    }
`;

export const GameHistory = styled.div`
    margin-bottom: 30px;
`;
