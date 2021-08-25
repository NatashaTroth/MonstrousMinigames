import * as React from 'react';

import Button from '../../../components/common/Button';
import LoadingComponent from '../../../components/common/LoadingComponent';
import Logo from '../../../components/common/Logo';
import { AudioContext } from '../../../contexts/AudioContextProvider';
import { ScreenSocketContext } from '../../../contexts/ScreenSocketContextProvider';
import { localBackend, localDevelopment } from '../../../utils/constants';
import { Routes } from '../../../utils/routes';
import { handleAudioPermission } from '../../audio/handlePermission';
import history from '../../history/history';
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
        setGettingStartedDialogOpen(true);
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
                    <Button type="button" name="new" onClick={handleCreateNewRoom} title="Create new room">
                        Create New Room
                    </Button>

                    <Button type="button" name="join" onClick={handleJoinRoom} title="Join an already existing room">
                        Join Room
                    </Button>

                    <Button type="button" name="tutorial" onClick={handleGettingStarted}>
                        About
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
