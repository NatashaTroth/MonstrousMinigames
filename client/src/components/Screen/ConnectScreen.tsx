import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import history from '../../domain/history/history';
import { localBackend, localDevelopment } from '../../utils/constants';
import { Routes } from '../../utils/routes';
import Button from '../common/Button';
import LoadingComponent from '../common/LoadingComponent';
import Logo from '../common/Logo';
import ConnectDialog from './ConnectDialog';
import {
    ButtonContainer,
    ConnectScreenContainer,
    LeftButtonContainer,
    LeftContainer,
    RightContainer,
} from './ConnectScreen.sc';
import GettingStartedDialog from './GettingStarted';

export const ConnectScreen: React.FunctionComponent = () => {
    const [joinDialogOpen, setJoinDialogOpen] = React.useState(false);
    const [gettingStartedDialogOpen, setGettingStartedDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const { handleSocketConnection } = React.useContext(ScreenSocketContext);
    const { audioPermission, setAudioPermissionGranted, initialPlayLobbyMusic } = React.useContext(AudioContext);

    async function handleCreateNewRoom() {
        setLoading(true);
        const response = await fetch(
            `${localDevelopment ? localBackend : process.env.REACT_APP_BACKEND_URL}create-room`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response) {
            setLoading(false);
        }

        const data = await response.json();
        handleSocketConnection(data.roomId, 'lobby');
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
    }

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        initialPlayLobbyMusic(true);
    }, []);

    async function handleJoinRoom() {
        setJoinDialogOpen(true);
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
    }

    async function handleGettingStarted() {
        setJoinDialogOpen(true);
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
    }

    return (
        <ConnectScreenContainer>
            {loading && <LoadingComponent />}
            <ConnectDialog open={joinDialogOpen} handleClose={() => setJoinDialogOpen(false)} />
            <GettingStartedDialog
                open={gettingStartedDialogOpen}
                handleClose={() => setGettingStartedDialogOpen(false)}
            />
            <LeftContainer>
                <LeftButtonContainer>
                    <Button type="button" name="new" onClick={handleCreateNewRoom}>
                        Create New Room
                    </Button>

                    <Button type="button" name="join" onClick={handleJoinRoom}>
                        Join Room
                    </Button>
                    <Button type="button" name="tutorial" onClick={handleGettingStarted}>
                        Getting Started
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
                            handleAudioPermission(audioPermission, { setAudioPermissionGranted });
                            history.push(Routes.credits);
                        }}
                    >
                        Credits
                    </Button>
                    <Button
                        type="button"
                        name="settings"
                        onClick={() => {
                            handleAudioPermission(audioPermission, { setAudioPermissionGranted });
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
