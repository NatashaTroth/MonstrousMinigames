import styled, { css } from 'styled-components';

const boxShadowDepth = 7;

export const Container = styled.div``;

interface ButtonProps {
    variant: 'primary' | 'secondary';
    fullwidth?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export const StyledButtonBase = styled.button<ButtonProps>`
    color: black;
    background: ${({ variant = 'primary', theme }) =>
        variant === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main};
    box-shadow: ${({ variant = 'primary', theme }) =>
        `calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0 ${
            variant === 'primary' ? theme.palette.primary.dark : theme.palette.secondary.dark
        }}`};
    cursor: pointer;
    padding: 10px;
    font-weight: 700;
    font-size: 22px;
    border: none;
    outline: transparent;

    &:not([disabled]) {
        &:hover {
            box-shadow: calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0
                ${({ theme }) => theme.palette.secondary.dark};
            background: ${({ theme }) => theme.palette.secondary.main};
        }

        &:active {
            transform: translateY(4px);
            box-shadow: calc(${boxShadowDepth} * 1px - 4px) calc(${boxShadowDepth} * 1px - 4px) 0
                ${({ theme }) => theme.palette.secondary.dark};
            background: ${({ theme }) => theme.palette.secondary.main};
        }
    }

    &:disabled {
        color: lightgray;
        box-shadow: calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0
            ${({ theme }) => theme.colors.disabledShadow};
        background: ${({ theme }) => theme.colors.disabled};
    }
`;

export const StyledButton = styled(StyledButtonBase)<ButtonProps>`
    && {
        border-radius: 10px;
        min-width: 200px;
        ${({ fullwidth }) => fullwidth && 'width: 100%;'}
        ${({ size }) => {
            switch (size) {
                case 'large':
                    return css`
                        height: 80px;
                    `;
                case 'small':
                    return css`
                        padding: 5px;
                        font-size: 18px;
                    `;
            }
        }}
    }
`;
