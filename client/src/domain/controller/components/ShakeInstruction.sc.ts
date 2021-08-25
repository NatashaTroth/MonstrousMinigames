import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
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
