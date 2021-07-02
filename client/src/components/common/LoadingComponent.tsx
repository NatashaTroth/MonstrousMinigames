import { CircularProgress } from '@material-ui/core';
import * as React from 'react';

import { LoadingContainer } from './LoadingComponent.sc';

const LoadingComponent: React.FC = () => (
    <LoadingContainer>
        <CircularProgress />
    </LoadingContainer>
);

export default LoadingComponent;
