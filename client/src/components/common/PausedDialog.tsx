import * as React from 'react';
import { isMobileOnly } from 'react-device-detect';

import { GameContext } from '../../contexts/GameContextProvider';
import { DialogContent, StyledDialog } from './PausedDialog.sc';

const PausedDialog: React.FunctionComponent = ({ children }) => {
    const { hasPaused } = React.useContext(GameContext);
    return isMobileOnly ? (
        <>
            <StyledDialog open={hasPaused}>
                <DialogContent>
                    <h3>Game has paused</h3>
                </DialogContent>
            </StyledDialog>
            {children}
        </>
    ) : (
        <> {children}</>
    );
};

export default PausedDialog;
