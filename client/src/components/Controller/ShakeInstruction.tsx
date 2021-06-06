import * as React from 'react';

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import { sendMovement } from '../../domain/gameState/controller/sendMovement';
import shakeIt from '../../images/shakeIt.svg';
import { localDevelopment } from '../../utils/constants';
import FullScreenContainer from '../common/FullScreenContainer';
import { Container, DialogContent, ShakeIt, StyledDialog } from './ShakeInstruction.sc';

const ShakeInstruction: React.FunctionComponent = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { playerFinished } = React.useContext(PlayerContext);
    const { hasPaused } = React.useContext(GameContext);

    React.useEffect(() => {
        if (localDevelopment) {
            if (!playerFinished) {
                setInterval(() => sendMovement(controllerSocket, hasPaused), 16.66667);
            }
        }
    }, []);
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
