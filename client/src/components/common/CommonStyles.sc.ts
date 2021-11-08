import styled from 'styled-components';

export const OrangeBase = styled.div`
    background-color: ${({ theme }) => theme.palette.secondary.main};
    box-shadow: calc(${({ theme }) => theme.boxShadowDepth} * 1px) calc(${({ theme }) => theme.boxShadowDepth} * 1px) 0
        ${({ theme }) => theme.palette.secondary.dark};
`;
