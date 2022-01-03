import { Typography } from '@material-ui/core';
import styled, { css } from 'styled-components';

import { StyledFullScreenContainer } from '../../../../components/controller/FullScreenContainer.sc';

export const InstructionContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px 0;
`;

interface Props {
    size?: 'small' | 'default';
}

export const PictureInstruction = styled(Typography)<Props>`
    font-size: 30px;
    color: ${({ theme }) => theme.palette.primary.main};
    font-weight: 700;
    font-style: italic;
    margin: 30px 0;
    padding: 0 60px;

    ${({ size = 'default' }) =>
        size === 'small' &&
        css`
            font-size: 20px;
            margin: 20px 0;
        `}
`;

export const RandomWord = styled(Typography)<Props>`
    font-size: 40px;
    color: ${({ theme }) => theme.palette.secondary.main};
    font-weight: 700;

    ${({ size = 'default' }) =>
        size === 'small' &&
        css`
            font-size: 25px;
        `}
`;

export const ScreenContainer = styled(StyledFullScreenContainer)`
    && {
        flex-direction: column;
    }
`;

export const ImagesContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-around;
    height: 50%;
`;
