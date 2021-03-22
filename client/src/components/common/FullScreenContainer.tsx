import * as React from 'react'

import { StyledFullScreenContainer } from './FullScreenContainer.sc'

const FullScreenContainer: React.FunctionComponent = ({ children }) => (
    <StyledFullScreenContainer>{children}</StyledFullScreenContainer>
)

export default FullScreenContainer
