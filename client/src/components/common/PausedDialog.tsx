import { Dialog } from '@material-ui/core';
import * as React from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';

import { GameContext } from '../../contexts/GameContextProvider';
import GameEventEmitter from '../../domain/phaser/GameEventEmitter';
import Button from './Button';
import { OrangeBase } from './CommonStyles.sc';

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
                    {!isMobile && <Button onClick={handleResume}>Resume</Button>}
                </DialogContent>
            </StyledDialog>
            {children}
        </>
    );
};

export default PausedDialog;

const StyledDialog = styled(Dialog)`
    && {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const DialogContent = styled(OrangeBase)`
    && {
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 10px;
    }
`;
