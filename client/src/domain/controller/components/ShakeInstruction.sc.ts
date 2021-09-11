import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: space-around;
`;

export const ShakeIt = styled.img`
    display: flex;
    width: 80%;
`;

export const Countdown = styled.div`
    color: ${({ theme }) => theme.palette.secondary.main};
    font-weight: 700;
    font-size: 70px;
`;

export const StyledPebbleImage = styled.img`
    width: 100%;
`;

const boxShadowDepth = 7;

export const PebbleButton = styled.div`
    width: 20%;
    padding: 20px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    box-shadow: ${({ theme }) =>
        `calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0 ${theme.palette.secondary.dark}}`};

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
`;

export const PebbleContainer = styled.div`
    display: flex;
    justify-content: center;
`;
