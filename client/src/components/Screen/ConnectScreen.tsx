import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
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

export const ConnectScreen: React.FunctionComponent = () => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const { handleSocketConnection } = React.useContext(ScreenSocketContext);
    const { playLobbyMusic, pauseLobbyMusic, permission, setPermissionGranted, playing, volume } = React.useContext(
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
        handleAudioPermission(permission, { setPermissionGranted });
    }

    React.useEffect(() => {
        handleAudioPermission(permission, { setPermissionGranted });
    }, []);

    async function handleJoinRoom() {
        setDialogOpen(true);
        handleAudioPermission(permission, { setPermissionGranted });
    }

    async function handleAudio() {
        handleAudioPermission(permission, { setPermissionGranted });

        if (playing) {
            pauseLobbyMusic(permission);
        } else {
            playLobbyMusic(permission);
        }
    }

    return (
        <ConnectScreenContainer>
            <ConnectDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />
            <AudioButton
                type="button"
                name="new"
                onClick={handleAudio}
                playing={playing}
                permission={permission}
                volume={volume}
            ></AudioButton>
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
                        {/*TODO add  handleAudioPermission(permission, setPermissionGranted) to onClick event*/}
                    </Button>
                </LeftButtonContainer>
            </LeftContainer>
            <RightContainer>
                <Logo />

                <ButtonContainer>
                    <Button
                        type="button"
                        name="credits"
                        onClick={() => {
                            handleAudioPermission(permission, { setPermissionGranted });
                            history.push('/credits');
                        }}
                    >
                        Credits
                    </Button>
                    <Button
                        type="button"
                        name="settings"
                        onClick={() => {
                            handleAudioPermission(permission, { setPermissionGranted });
                            history.push('/settings');
                        }}
                    >
                        Settings
                    </Button>
                </ButtonContainer>
            </RightContainer>
        </ConnectScreenContainer>
    );
};
