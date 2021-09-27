/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox, createStyles, FormControlLabel, makeStyles, Theme } from '@material-ui/core';
import * as React from 'react';

import Button from '../../../components/common/Button';
import { AudioContext } from '../../../contexts/AudioContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import shakeInstructionsDemo from '../../../images/ui/shakeInstructionDemo.png';
import spiderDemo from '../../../images/ui/spiderDemo.png';
import trashDemo from '../../../images/ui/trashDemo.png';
import treeDemo from '../../../images/ui/treeDemo.png';
import { screenGetReadyRoute } from '../../../utils/routes';
import { handleAudioPermission } from '../../audio/handlePermission';
import history from '../../history/history';
import {
    BackButtonContainer,
    ControlInstruction,
    ControlInstructionsContainer,
    GameIntroBackground,
    GameIntroContainer,
    ImageDescription,
    InstructionImg,
    IntroText,
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
    const { roomId } = React.useContext(GameContext);
    const [showFirstIntro, setShowFirstIntro] = React.useState(true);
    const [doNotShowChecked, setDoNotShowChecked] = React.useState(false);
    const { audioPermission, setAudioPermissionGranted, initialPlayLobbyMusic } = React.useContext(AudioContext);

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
                    </div>
                )}

                <PaddingContainer>
                    <StyledFormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={doNotShowChecked}
                                    onChange={() => setDoNotShowChecked(!doNotShowChecked)}
                                    classes={{
                                        root: classes.root,
                                        checked: classes.checked,
                                    }}
                                />
                            }
                            label="Don't show these instructions again"
                        />
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
