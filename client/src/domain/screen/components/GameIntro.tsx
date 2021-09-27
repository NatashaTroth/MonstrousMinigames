import { Checkbox, createStyles, FormControlLabel, makeStyles, Theme } from '@material-ui/core';
import * as React from 'react';

import Button from '../../../components/common/Button';
import { AudioContext } from '../../../contexts/AudioContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../../contexts/ScreenSocketContextProvider';
import { MessageTypes } from '../../../utils/constants';
import { Routes, screenGetReadyRoute } from '../../../utils/routes';
import { ScreenStates } from '../../../utils/screenStates';
import { handleAudioPermission } from '../../audio/handlePermission';
import history from '../../history/history';
import {
    BackButtonContainer,
    ControlInstruction,
    ControlInstructionsContainer,
    GameIntroBackground,
    GameIntroContainer,
    ImageDescription,
    IntroText,
    PaddingContainer,
    PreviewImageContainer,
    StyledFormGroup,
} from './GameIntro.sc';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            color: theme.status.checked,
            '&$checked': {
                color: theme.status.checked,
            },
        },
        checked: {},
    })
);

const GameIntro: React.FunctionComponent = () => {
    const { roomId, screenAdmin, screenState } = React.useContext(GameContext);
    const [showFirstIntro, setShowFirstIntro] = React.useState(true);
    const [doNotShowChecked, setDoNotShowChecked] = React.useState(false);
    const { audioPermission, setAudioPermissionGranted, initialPlayLobbyMusic } = React.useContext(AudioContext);
    const { screenSocket } = React.useContext(ScreenSocketContext);

    function handleNext() {
        if (showFirstIntro) {
            setShowFirstIntro(false);
        } else {
            if (doNotShowChecked) {
                localStorage.setItem('tutorial', 'seen');
            }
            history.push(screenGetReadyRoute(roomId));
        }
    }

    const classes = useStyles();

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        initialPlayLobbyMusic(true);
    }, []);

    React.useEffect(() => {
        if (screenAdmin) {
            screenSocket?.emit({
                type: MessageTypes.screenState,
                state: ScreenStates.gameIntro,
            });
        }
    });

    React.useEffect(() => {
        if (!screenAdmin && screenState !== ScreenStates.gameIntro) {
            history.push(`${Routes.screen}/${roomId}/${screenState}`);
        }
    }, [screenState]);

    return (
        <GameIntroContainer>
            <GameIntroBackground>
                {showFirstIntro ? (
                    <IntroText>
                        {/* TODO remove and add content*/}
                        Animation, die die Geschichte der Monster erklärt mit kurzen Animationen dazu. (entweder
                        Voice-over oder mit Text)
                    </IntroText>
                ) : (
                    <div>
                        <PreviewImageContainer />
                        {/* TODO make dynamic */}
                        {/* <PreviewImage src={forest} /> */}

                        <ImageDescription>
                            Your goal is to be the first player to reach safety in the cave while conquering obstacles
                            along the way!
                        </ImageDescription>
                        <ControlInstructionsContainer>
                            <ControlInstruction>Shake your phone to run!</ControlInstruction>
                            <ControlInstruction>Swipe your screen to slice the tree trunk!</ControlInstruction>
                            <ControlInstruction>Blow into your phone to scare the spider away!</ControlInstruction>
                            <ControlInstruction>Move the trash in the right trash container!</ControlInstruction>
                        </ControlInstructionsContainer>
                    </div>
                )}

                <PaddingContainer>
                    <StyledFormGroup row>
                        {screenAdmin && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={doNotShowChecked}
                                        onChange={() => setDoNotShowChecked(!doNotShowChecked)}
                                        classes={{
                                            root: classes.root,
                                            checked: classes.checked,
                                        }}
                                        hidden={!screenAdmin}
                                    />
                                }
                                label="Don't show these instructions again"
                            />
                        )}
                    </StyledFormGroup>
                    <BackButtonContainer>
                        {!screenAdmin && !showFirstIntro ? (
                            <Button onClick={handleNext}>Previous</Button>
                        ) : (
                            <Button onClick={handleNext}>Next</Button>
                        )}
                    </BackButtonContainer>
                </PaddingContainer>
            </GameIntroBackground>
        </GameIntroContainer>
    );
};

export default GameIntro;
