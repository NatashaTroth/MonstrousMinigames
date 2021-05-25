import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import history from '../../domain/history/history';
import AudioButton from '../common/AudioButton';
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
    const { playLobbyMusic, pauseLobbyMusic, permission, setPermissionGranted, playing } = React.useContext(
        AudioContext
    );

    async function handleCreateNewRoom() {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}create-room`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        handleSocketConnection(data.roomId, 'lobby');

        handleAudio();
    }

    async function handleJoinRoom() {
        setDialogOpen(true);
        handleAudio();
    }

    async function handleAudio() {
        const w = window as WindowProps;
        const AudioContext = window.AudioContext || w.webkitAudioContext || false;

        if (!permission) {
            if (AudioContext) {
                // eslint-disable-next-line no-console
                console.log('setting permission');
                setPermissionGranted(true);
                new AudioContext().resume();
            }
        }

        if (playing) {
            pauseLobbyMusic(permission);
        } else {
            playLobbyMusic(permission);
        }
    }

    return (
        <ConnectScreenContainer>
            <ConnectDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />
            <AudioButton type="button" name="new" onClick={handleAudio} playing={playing}></AudioButton>
            <LeftContainer>
                <LeftButtonContainer>
                    <Button type="button" name="new" onClick={handleCreateNewRoom}>
                        Create New Room
                    </Button>
                    <Button type="button" name="join" onClick={handleJoinRoom}>
                        Join Room
                    </Button>
                    <Button type="button" name="tutorial" disabled>
                        Getting Started
                    </Button>
                </LeftButtonContainer>
            </LeftContainer>
            <RightContainer>
                <Logo />

                <ButtonContainer>
                    <Button type="button" name="credits" onClick={() => history.push('/credits')}>
                        Credits
                    </Button>
                    <Button type="button" name="settings" onClick={() => history.push('/settings')} disabled>
                        Settings
                    </Button>
                </ButtonContainer>
            </RightContainer>
        </ConnectScreenContainer>
    );
};
