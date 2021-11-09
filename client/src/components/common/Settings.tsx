import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { VolumeOff } from '@material-ui/icons';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { handleAudio } from '../../domain/audio/handleAudio';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import history from '../../domain/history/history';
import Button from './Button';
import {
    BackButtonContainer,
    ContentBase,
    ContentContainer,
    FullScreenContainer,
    Headline,
} from './FullScreenStyles.sc';
import IconButton from './IconButton';
import { StyledGridContainer, VolumeContainer } from './Settings.sc';

const Settings: React.FunctionComponent = () => {
    const {
        setAudioVolume,
        volume,
        audioPermission,
        setAudioPermissionGranted,
        playing,
        pauseLobbyMusic,
        playLobbyMusic,
        musicIsPlaying,
        initialPlayLobbyMusic,
    } = React.useContext(AudioContext);

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        initialPlayLobbyMusic(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (event: React.ChangeEvent<unknown>, newValue: number | number[]): void => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        updateVolume(
            typeof newValue == 'number' ? newValue : newValue[0],
            volume,
            pauseLobbyMusic,
            playLobbyMusic,
            setAudioVolume
        );
    };

    return (
        <FullScreenContainer>
            <ContentContainer>
                <ContentBase>
                    <Headline>Settings</Headline>
                    <VolumeContainer>
                        <Typography gutterBottom>Sound Volume</Typography>
                        <StyledGridContainer container spacing={2}>
                            <Grid item>
                                <VolumeDown />
                            </Grid>
                            <Grid item xs>
                                <Slider
                                    value={volume}
                                    onChange={handleChange}
                                    aria-labelledby="continuous-slider"
                                    step={0.05}
                                    min={0}
                                    max={1}
                                />
                            </Grid>
                            <Grid item>
                                <VolumeUp />
                            </Grid>
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
                        </StyledGridContainer>
                    </VolumeContainer>
                </ContentBase>
            </ContentContainer>
            <BackButtonContainer>
                <Button onClick={history.goBack}>Back</Button>
            </BackButtonContainer>
        </FullScreenContainer>
    );
};

export default Settings;

export const volumeHasBeenUnmuted = (newValue: number, volume: number) => {
    return newValue > 0 && volume === 0;
};

export const updateVolume = async (
    newValue: number,
    volume: number,
    pauseLobbyMusic: (val: boolean) => void,
    playLobbyMusic: (val: boolean) => void,
    setAudioVolume: (val: number) => void
) => {
    if (newValue === 0) await pauseLobbyMusic(true);
    else if (volumeHasBeenUnmuted(newValue, volume)) {
        await playLobbyMusic(true);
    }

    setAudioVolume(newValue);
};
