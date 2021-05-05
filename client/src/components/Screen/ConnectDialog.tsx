import { Dialog, IconButton } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import * as React from 'react';

import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import Button from '../common/Button';
import { CloseButtonContainer, DialogContent, StyledForm, StyledInput, StyledLabel } from './ConnectDialog.sc';

interface IFormState {
    roomId: string;
}

interface ConnectDialog {
    open: boolean;
    handleClose: () => void;
}
const ConnectDialog: React.FunctionComponent<ConnectDialog> = ({ handleClose, ...props }) => {
    const [formState, setFormState] = React.useState<undefined | IFormState>({ roomId: '' });
    const { handleSocketConnection } = React.useContext(ScreenSocketContext);

    return (
        <Dialog
            {...props}
            // PaperProps={{
            //     style: {
            //         backgroundColor: 'transparent',
            //         boxShadow: 'none',
            //     },
            // }}
        >
            <StyledForm
                onSubmit={e => {
                    e.preventDefault();
                    handleSocketConnection(formState?.roomId || '');
                }}
            >
                <CloseButtonContainer>
                    <IconButton onClick={handleClose}>
                        <Cancel />
                    </IconButton>
                </CloseButtonContainer>
                <DialogContent>
                    <StyledLabel>
                        Enter Room Code:
                        <StyledInput
                            type="text"
                            name="roomId"
                            value={formState?.roomId}
                            onChange={e => setFormState({ ...formState, roomId: e.target.value })}
                            placeholder="Insert a room code"
                        />
                    </StyledLabel>
                    <Button type="submit" name="join" text="Join" disabled={!formState?.roomId} />
                </DialogContent>
            </StyledForm>
        </Dialog>
    );
};

export default ConnectDialog;
