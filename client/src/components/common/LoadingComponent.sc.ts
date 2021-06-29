import styled from 'styled-components';

export const LoadingContainer = styled.div`
    position: absolute;
    top: calc(50% - 10px);
    left: calc(50% - 10px);
    background: ${({ theme }) => theme.palette.secondary.main};
    padding: 20px;
    border-radius: 20px;

    .MuiCircularProgress-colorPrimary {
        color: black;
    }
`;
