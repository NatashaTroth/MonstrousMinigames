import { Grid } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { VolumeOff } from '@material-ui/icons';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import * as React from 'react';
import styled from 'styled-components';

import { MyAudioContext } from '../../contexts/AudioContextProvider';
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

const Settings: React.FunctionComponent = () => {
    const { isPlaying, setVolume, volume, togglePlaying } = React.useContext(MyAudioContext);

    const handleChange = (event: React.ChangeEvent<unknown>, newValue: number | number[]): void => {
        setVolume(typeof newValue === 'number' ? newValue : newValue[0]);
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
                                <Slider value={volume} onChange={handleChange} step={0.05} min={0} max={1} />
                            </Grid>
                            <Grid item>
                                <VolumeUp />
                            </Grid>
                            <IconButton onClick={() => togglePlaying()}>
                                {isPlaying ? <VolumeUp /> : <VolumeOff />}
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

const VolumeContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 40%;
    margin-bottom: 30px;
`;

const StyledGridContainer = styled(Grid)`
    align-items: center;
`;
