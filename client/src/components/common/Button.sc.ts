import styled from 'styled-components';

import { disabled, disabledShadow, primary, primaryShadow, secondary, secondaryShadow } from '../../utils/colors';

const boxShadowDepth = 7;

export const Container = styled.div``;

interface ButtonProps {
    variant: 'primary' | 'secondary';
    fullwidth: boolean;
}

export const StyledButton = styled.button<ButtonProps>`
    color: black;
    background: ${({ variant = 'primary' }) => (variant === 'primary' ? primary : secondary)};
    box-shadow: ${({ variant = 'primary' }) =>
        `calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0 ${
            variant === 'primary' ? primaryShadow : secondaryShadow
        }}`};
    cursor: pointer;
    padding: 10px;
    border-radius: 10px;
    min-width: 200px;
    ${({ fullwidth }) => fullwidth && 'width: 100%;'}
    font-weight: 700;
    font-size: 22px;
    border: none;
    outline: transparent;

    &:not([disabled]) {
        &:hover {
            transform: translateY(4px);
            box-shadow: ${({
                variant = 'primary',
            }) => `calc(${boxShadowDepth} * 1px - 4px) calc(${boxShadowDepth} * 1px - 4px) 0
                ${variant === 'primary' ? primaryShadow : secondaryShadow}`};
        }
    }

    &:disabled {
        color: lightgray;
        box-shadow: calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0 ${disabledShadow};
        background: ${disabled};
    }
`;
