import { VolumeOff, VolumeUp } from '@material-ui/icons';
import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudio } from '../../domain/audio/handleAudio';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import history from '../../domain/history/history';
import { Routes } from '../../utils/routes';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
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
    const {
        playLobbyMusic,
        pauseLobbyMusic,
        permission,
        setPermissionGranted,
        playing,
        musicIsPlaying,
    } = React.useContext(AudioContext);

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

    return (
        <ConnectScreenContainer>
            <ConnectDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />
            <IconButton
                onClick={() =>
                    handleAudio({ playing, permission, pauseLobbyMusic, playLobbyMusic, setPermissionGranted })
                }
            >
                {musicIsPlaying ? <VolumeUp /> : <VolumeOff />}
            </IconButton>
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
                            history.push(Routes.credits);
                        }}
                    >
                        Credits
                    </Button>
                    <Button
                        type="button"
                        name="settings"
                        onClick={() => {
                            handleAudioPermission(permission, { setPermissionGranted });
                            history.push(Routes.settings);
                        }}
                    >
                        Settings
                    </Button>
                </ButtonContainer>
            </RightContainer>
        </ConnectScreenContainer>
    );
};
