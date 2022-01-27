import styled from 'styled-components';

import { StyledFullScreenContainer } from './FullScreenContainer.sc';

interface Props {
    available: boolean;
}

export const ChooseCharacterContainer = styled(StyledFullScreenContainer)`
    align-items: initial;
`;

export const Character = styled.img<Props>`
    width: 100%;
    height: 100%;
    opacity: ${({ available }) => (available ? 1 : 0.5)};
`;

export const CharacterContainer = styled.div`
    width: 100%;
    height: 100%;
`;

export const ChooseButtonContainer = styled.div`
    margin-top: 30px;
`;

const CustomButton = styled.button`
    position: absolute;
    outline: 0;
    transition: all 0.5s;
    z-index: 1000;
    min-width: 43px;
    min-height: 43px;
    opacity: 1;
    cursor: pointer;

    color: black;
    background: ${({ theme }) => theme.palette.primary.main};
    box-shadow: calc(${({ theme }) => theme.boxShadowDepth} * 1px) calc(${({ theme }) => theme.boxShadowDepth} * 1px) 0
        ${({ theme }) => theme.palette.primary.dark};

    padding: 10px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 22px;
    border: none;
    outline: transparent;

    &:hover {
        box-shadow: calc(${({ theme }) => theme.boxShadowDepth} * 1px)
            calc(${({ theme }) => theme.boxShadowDepth} * 1px) 0 ${({ theme }) => theme.palette.secondary.dark};
        background: ${({ theme }) => theme.palette.secondary.main};
    }

    &:active {
        transform: translateY(4px);
        box-shadow: calc(${({ theme }) => theme.boxShadowDepth} * 1px - 4px)
            calc(${({ theme }) => theme.boxShadowDepth} * 1px - 4px) 0 ${({ theme }) => theme.palette.secondary.dark};
        background: ${({ theme }) => theme.palette.secondary.main};
    }
`;

export const Right = styled(CustomButton)`
    right: calc(4% + 1px);
`;

export const Left = styled(CustomButton)`
    left: calc(4% + 1px);
`;

export const ClearContainer = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
`;
