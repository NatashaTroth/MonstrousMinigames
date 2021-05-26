import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { handlePermission } from '../../domain/audio/handlePermission';
import history from '../../domain/history/history';
import Button from './Button';
import {
    BackButtonContainer, Content, ContentContainer, Headline, SettingsContainer
} from './Settings.sc';

const useStyles = makeStyles({
    root: {
        width: 200,
    },
});

const Settings: React.FunctionComponent = () => {
    const roomId = sessionStorage.getItem('roomId');
    const classes = useStyles();
    const { setAudioVolume, volume, permission, setPermissionGranted } = React.useContext(AudioContext);
    const [value, setValue] = React.useState(volume);

    // React.useEffect(() => {
    //     // eslint-disable-next-line no-console
    //     // console.log('here ', volume);
    //     // setValue(volume);

    //     return () => {
    //         // eslint-disable-next-line no-console
    //         console.log('UNLOADING ', value);
    //         setVolume(value);
    //     };
    // }, [value]);

    //TODO but not yet working
    // useBeforeunload(() => {
    //     // eslint-disable-next-line no-console
    //     console.log('UNLOADING ');
    //     setVolume(value);
    // });

    const handleChange = (event: React.ChangeEvent<unknown>, newValue: number | number[]): void => {
        if (handlePermission(permission)) setPermissionGranted(true);
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
                        </Grid>
                    </div>
                </Content>
                <BackButtonContainer>
                    <Button onClick={() => history.push(`/${roomId}`)}>Back</Button>
                </BackButtonContainer>
            </ContentContainer>
        </SettingsContainer>
    );
};

export default Settings;
