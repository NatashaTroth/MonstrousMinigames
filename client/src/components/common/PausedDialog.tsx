import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import GameEventEmitter from '../../domain/game1/screen/phaser/GameEventEmitter';
import Button from './Button';
import { DialogContent, StyledDialog } from './PausedDialog.sc';

const PausedDialog: React.FunctionComponent = ({ children }) => {
    const { hasPaused } = React.useContext(GameContext);

    async function handleResume() {
        GameEventEmitter.emitPauseResumeEvent();
    }
    return (
        <>
            <StyledDialog
                open={hasPaused}
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        padding: 20,
                    },
                }}
            >
                <DialogContent>
                    <h3>Game has paused</h3>
                    <Button onClick={handleResume}>Resume</Button>
                </DialogContent>
            </StyledDialog>
            {children}
        </>
    );
};

export default PausedDialog;
