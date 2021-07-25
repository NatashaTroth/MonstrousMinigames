import { CircularProgress } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
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

const LoadingComponent: React.FC = () => (
    <LoadingContainer>
        <CircularProgress />
    </LoadingContainer>
);

export default LoadingComponent;
