import * as React from 'react';

import { StyledFullScreenContainer } from '../controller/FullScreenContainer.sc';

const FullScreenContainer: React.FunctionComponent = ({ children }) => (
    <StyledFullScreenContainer>{children}</StyledFullScreenContainer>
);

export default FullScreenContainer;
