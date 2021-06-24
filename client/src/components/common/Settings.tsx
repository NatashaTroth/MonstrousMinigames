import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
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
import IconButton from './IconButton';
import {
    BackButtonContainer,
    Content,
    ContentContainer,
    Headline,
    SettingsContainer,
    StyledGridContainer,
    VolumeContainer,
} from './Settings.sc';

const useStyles = makeStyles({
    root: {
        width: 200,
    },
});

const Settings: React.FunctionComponent = () => {
    const classes = useStyles();
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
    const [value, setValue] = React.useState(volume);

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        initialPlayLobbyMusic(true);
    }, []);

    React.useEffect(() => {
        setValue(volume);
    }, [volume]);

    //TODO natasha
    // React.useEffect(() => {
    //     // setValue(volume);

    //     return () => {
    //         setVolume(value);
    //     };
    // }, [value]);

    const handleChange = (event: React.ChangeEvent<unknown>, newValue: number | number[]): void => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        if (typeof newValue == 'number') updateVolume(newValue);
        else updateVolume(newValue[0]);
    };

    const updateVolume = async (newValue: number) => {
        if (newValue === 0) await pauseLobbyMusic(true);
        else if (volumeHasBeenUnmuted(newValue)) {
            await playLobbyMusic(true);
        }

        setAudioVolume(newValue);
        setValue(newValue);
    };

    const volumeHasBeenUnmuted = (newValue: number) => {
        return newValue > 0 && volume === 0;
    };

    return (
        <SettingsContainer>
            <ContentContainer>
                <Content>
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
                </Content>
                <BackButtonContainer>
                    <Button onClick={history.goBack}>Back</Button>
                </BackButtonContainer>
            </ContentContainer>
        </SettingsContainer>
    );
};

export default Settings;
