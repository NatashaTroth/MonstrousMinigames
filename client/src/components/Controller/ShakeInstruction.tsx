import * as React from 'react';

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import { sendMovement } from '../../domain/gameState/sendMovement';
import { localDevelopment } from '../../utils/constants';
import FullScreenContainer from '../common/FullScreenContainer';
import {
    Container, DialogContent, StyledDialog, StyledRotationIcon, StyledShakeInstruction
} from './ShakeInstruction.sc';

const ShakeInstruction: React.FunctionComponent = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { playerFinished } = React.useContext(PlayerContext);
    const { hasPaused } = React.useContext(GameContext);

    if (localDevelopment) {
        if (!playerFinished) {
            setInterval(() => sendMovement(controllerSocket, hasPaused), 100);
        }
    }

    return (
        <>
            <StyledDialog open={hasPaused}>
                <DialogContent>
                    <h3>Game has paused</h3>
                </DialogContent>
            </StyledDialog>
            <FullScreenContainer>
                <Container>
                    <StyledRotationIcon />
                    <StyledShakeInstruction>
                        <span>SHAKE YOUR PHONE!</span>
                        <span>(and maybe your booty)</span>
                    </StyledShakeInstruction>
                </Container>
            </FullScreenContainer>
        </>
    );
};

export default ShakeInstruction;
