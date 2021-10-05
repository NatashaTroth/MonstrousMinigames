/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox, createStyles, FormControlLabel, makeStyles, Theme } from '@material-ui/core';
import * as React from 'react';

import { GameNames } from '../../config/games';
import { ScreenStates } from '../../config/screenStates';
import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import history from '../../domain/history/history';
import shakeInstructionsDemo from '../../images/ui/shakeInstructionDemo.png';
import spiderDemo from '../../images/ui/spiderDemo.png';
import trashDemo from '../../images/ui/trashDemo.png';
import treeDemo from '../../images/ui/treeDemo.png';
import { MessageTypes } from '../../utils/constants';
import { Routes, screenGetReadyRoute } from '../../utils/routes';
import Button from '../common/Button';
import {
    BackButtonContainer,
    ControlInstruction,
    ControlInstructionsContainer,
    GameIntroBackground,
    GameIntroContainer,
    ImageDescription,
    InstructionImg,
    IntroContentWrapper,
    PaddingContainer,
    PreviewImageContainer,
    StyledFormGroup,
    Wrapper,
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
    const { roomId, screenAdmin, screenState, chosenGame } = React.useContext(GameContext);
    const [doNotShowChecked, setDoNotShowChecked] = React.useState(false);
    const { audioPermission, setAudioPermissionGranted, initialPlayLobbyMusic } = React.useContext(AudioContext);
    const { screenSocket } = React.useContext(ScreenSocketContext);

    function handleNext() {
        if (doNotShowChecked) {
            localStorage.setItem('tutorial', 'seen');
        }
        history.push(screenGetReadyRoute(roomId));
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
                <IntroContentWrapper>
                    {chosenGame === GameNames.game1 && (
                        <>
                            <PreviewImageContainer />
                            <ImageDescription>
                                Your goal is to be the first player to reach safety in the cave while conquering
                                obstacles along the way!
                            </ImageDescription>
                            <ControlInstructionsContainer>
                                <Wrapper>
                                    <ControlInstruction>Shake your phone to run!</ControlInstruction>
                                    <InstructionImg src={shakeInstructionsDemo} />
                                </Wrapper>
                                <Wrapper>
                                    <ControlInstruction>
                                        Remove the tree trunk by cutting it along the line!
                                    </ControlInstruction>
                                    <InstructionImg src={treeDemo} />
                                </Wrapper>
                                <Wrapper>
                                    <ControlInstruction>
                                        Blow into the microphone to get rid of the spider!
                                    </ControlInstruction>
                                    <InstructionImg src={spiderDemo} />
                                </Wrapper>
                                <Wrapper>
                                    <ControlInstruction>
                                        Put the right trash in the garbage can to get the forest clean again!
                                    </ControlInstruction>
                                    <InstructionImg src={trashDemo} />
                                </Wrapper>
                            </ControlInstructionsContainer>
                        </>
                    )}
                </IntroContentWrapper>

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
                        <Button onClick={handleNext}>Next</Button>
                    </BackButtonContainer>
                </PaddingContainer>
            </GameIntroBackground>
        </GameIntroContainer>
    );
};

export default GameIntro;
