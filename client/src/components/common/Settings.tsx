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
    BackButtonContainer, Content, ContentContainer, Headline, SettingsContainer
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
        lobbyMusicPlaying,
        pauseLobbyMusic,
        playLobbyMusic,
        musicIsPlaying,
    } = React.useContext(AudioContext);
    const [value, setValue] = React.useState(volume);

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        // handleAudio({
        //     lobbyMusicPlaying,
        //     audioPermission: true, //context provider is too slow to update
        //     pauseLobbyMusic,
        //     playLobbyMusic,
        //     setAudioPermissionGranted,
        // });
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

        if (typeof newValue == 'number') {
            setAudioVolume(newValue);
            setValue(newValue);
        } else {
            setAudioVolume(newValue[0]);
            setValue(newValue[0]);
        }
    };

    return (
        <SettingsContainer>
            <ContentContainer>
                <Content>
                    <Headline>Settings</Headline>
                    <div className={classes.root}>
                        <Typography id="continuous-slider" gutterBottom>
                            Volume
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item>
                                <VolumeDown />
                            </Grid>
                            <Grid item xs>
                                <Slider
                                    value={value}
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
                                        lobbyMusicPlaying,
                                        audioPermission,
                                        pauseLobbyMusic,
                                        playLobbyMusic,
                                        setAudioPermissionGranted,
                                    })
                                }
                            >
                                {musicIsPlaying ? <VolumeUp /> : <VolumeOff />}
                            </IconButton>
                        </Grid>
                    </div>
                </Content>
                <BackButtonContainer>
                    <Button onClick={history.goBack}>Back</Button>
                </BackButtonContainer>
            </ContentContainer>
        </SettingsContainer>
    );
};

export default Settings;
