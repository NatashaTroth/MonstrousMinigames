import { Dialog } from '@material-ui/core';
import * as React from 'react';

import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import Button from '../common/Button';
import { DialogContent, InputContainer, InputLabel, StyledForm, StyledInput } from './ConnectDialog.sc';

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
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    padding: 20,
                },
            }}
            onClose={handleClose}
        >
            <DialogContent>
                <StyledForm
                    onSubmit={e => {
                        e.preventDefault();
                        handleSocketConnection((formState?.roomId || '').toUpperCase(), 'lobby');
                    }}
                >
                    <InputContainer>
                        <InputLabel>Enter the Room Code here:</InputLabel>
                        <StyledInput
                            type="text"
                            name="roomId"
                            value={formState?.roomId}
                            onChange={e => setFormState({ ...formState, roomId: e.target.value })}
                        />
                        <Button type="submit" name="join" disabled={!formState?.roomId}>
                            Enter
                        </Button>
                    </InputContainer>
                </StyledForm>
            </DialogContent>
        </Dialog>
    );
};

export default ConnectDialog;
