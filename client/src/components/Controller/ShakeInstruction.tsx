import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import shakeIt from '../../images/ui/shakeIt.svg';
import FullScreenContainer from '../common/FullScreenContainer';
import { Container, DialogContent, ShakeIt, StyledDialog } from './ShakeInstruction.sc';

const ShakeInstruction: React.FunctionComponent = () => {
    const { hasPaused } = React.useContext(GameContext);

    return (
        <>
            <StyledDialog open={hasPaused}>
                <DialogContent>
                    <h3>Game has paused</h3>
                </DialogContent>
            </StyledDialog>
            <FullScreenContainer>
                <Container>
                    <ShakeIt src={shakeIt} />
                </Container>
            </FullScreenContainer>
        </>
    );
};

export default ShakeInstruction;
