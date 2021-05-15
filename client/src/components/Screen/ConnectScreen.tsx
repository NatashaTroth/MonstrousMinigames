import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import history from '../../domain/history/history';
import Button from '../common/Button';
import Logo from '../common/Logo';
import ConnectDialog from './ConnectDialog';
import {
    ButtonContainer,
    ConnectScreenContainer,
    LeftButtonContainer,
    LeftContainer,
    RightContainer,
} from './ConnectScreen.sc';

interface WindowProps extends Window {
    webkitAudioContext?: typeof AudioContext;
}

export const ConnectScreen: React.FunctionComponent = () => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const { handleSocketConnection } = React.useContext(ScreenSocketContext);
    const { setPermissionGranted } = React.useContext(AudioContext);

    async function handleCreateNewRoom() {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}create-room`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        handleSocketConnection(data.roomId, 'lobby');

        setAudioContext();
    }

    async function handleJoinRoom() {
        setDialogOpen(true);
        setAudioContext();
    }

    async function setAudioContext() {
        const w = window as WindowProps;
        const AudioContext = window.AudioContext || w.webkitAudioContext || false;

        if (AudioContext) {
            setPermissionGranted(true);
            new AudioContext().resume();
        }
    }

    return (
        <ConnectScreenContainer>
            <ConnectDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />
            <LeftContainer>
                <LeftButtonContainer>
                    <Button type="button" name="new" text="Create New Room" onClick={handleCreateNewRoom} />
                    <Button type="button" name="join" text="Join Room" onClick={handleJoinRoom} />
                    <Button type="button" name="tutorial" text="Tutorial" disabled />
                </LeftButtonContainer>
            </LeftContainer>
            <RightContainer>
                <Logo />

                <ButtonContainer>
                    <Button type="button" name="credits" text="Credits" onClick={() => history.push('/credits')} />
                    <Button
                        type="button"
                        name="settings"
                        text="Settings"
                        onClick={() => history.push('/settings')}
                        disabled
                    />
                </ButtonContainer>
            </RightContainer>
        </ConnectScreenContainer>
    );
};
