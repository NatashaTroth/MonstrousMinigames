import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const boxShadowDepth = 8;
const fontSize = 1;

export const StyledInput = styled.input`
    color: black;
    border: none;
    background: #bde5dd;
    cursor: pointer;
    font-weight: 700;
    font-size: calc(${fontSize} * 1rem);
    margin: 30px 0;
    height: 50px;
    width: 100%;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 20px;

    &:focus,
    &:active {
        outline: none;
    }
`;

export const DialogContent = styled.div`
    padding: 40px 100px;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    border-radius: 10px;
    box-shadow: calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0
        ${({ theme }) => theme.palette.secondary.dark};
`;

export const StyledTypography = styled(Typography)`
    && {
        margin-bottom: 20px;
        letter-spacing: 1px;
        line-height: 1.8;
    }
`;
