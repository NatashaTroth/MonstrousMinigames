import { Settings, VolumeOff, VolumeUp } from '@material-ui/icons';
import { History } from 'history';
import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { handleAudio } from '../../domain/audio/handleAudio';
import { Routes } from '../../utils/routes';
import IconButton from '../common/IconButton';
import { InnerContainer, StyledContainer } from './MasterHeader.sc';

interface MasterHeaderProps {
    history: History;
}

const MasterHeader: React.FC<MasterHeaderProps> = ({ history }) => {
    const {
        playLobbyMusic,
        pauseLobbyMusic,
        audioPermission,
        setAudioPermissionGranted,
        playing,
        musicIsPlaying,
    } = React.useContext(AudioContext);

    if (history.location.pathname.includes(Routes.game1)) {
        return null;
    }

    return (
        <StyledContainer>
            <InnerContainer>
                <IconButton onClick={() => history.push(Routes.settings)} right={80}>
                    <Settings />
                </IconButton>
                <IconButton
                    onClick={() =>
                        handleAudio({
                            playing,
                            audioPermission,
                            pauseLobbyMusic,
                            playLobbyMusic,
                            setAudioPermissionGranted,
                        })
                    }
                >
                    {musicIsPlaying ? <VolumeUp /> : <VolumeOff />}
                </IconButton>
            </InnerContainer>
        </StyledContainer>
    );
};
export default MasterHeader;
