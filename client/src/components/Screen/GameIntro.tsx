import { VolumeOff, VolumeUp } from '@material-ui/icons';
import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import history from '../../domain/history/history';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
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
} from './GameIntro.sc';

const GameIntro: React.FunctionComponent = () => {
    const [showFirstIntro, setShowFirstIntro] = React.useState(true);
    const { roomId } = React.useContext(GameContext);
    const {
        playLobbyMusic,
        pauseLobbyMusic,
        permission,
        playing,
        setPermissionGranted,
        musicIsPlaying,
    } = React.useContext(AudioContext);

    function handleSkip() {
        if (showFirstIntro) {
            setShowFirstIntro(false);
        } else {
            localStorage.setItem('tutorial', 'seen');
            history.push(`/screen/${roomId}/get-ready`);
        }
    }
    const handleAudioPermissionCallback = React.useCallback(() => {
        handleAudioPermission(permission, { setPermissionGranted });
    }, [permission, setPermissionGranted]);

    React.useEffect(() => {
        handleAudioPermissionCallback();
    }, [handleAudioPermissionCallback]);

    async function handleAudio() {
        handleAudioPermissionCallback();

        if (playing) {
            pauseLobbyMusic(permission);
        } else {
            playLobbyMusic(permission);
        }
    }
    return (
        <GameIntroContainer>
            <IconButton onClick={handleAudio}>{musicIsPlaying ? <VolumeUp /> : <VolumeOff />}</IconButton>
            <GameIntroBackground>
                {showFirstIntro ? (
                    <IntroText>
                        {/* TODO remove and add content */}
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
                            <ControlInstruction>Shake your phone in order to run!</ControlInstruction>
                            <ControlInstruction>Swipe your screen in order to slice the tree trunk!</ControlInstruction>
                            <ControlInstruction>Blow into your phone to blow the spider away!</ControlInstruction>
                            <ControlInstruction>
                                Move the stones and leaves into the hole to run over it!
                            </ControlInstruction>
                        </ControlInstructionsContainer>
                    </div>
                )}
                <PaddingContainer>
                    <BackButtonContainer>
                        <Button onClick={handleSkip}>Skip</Button>
                    </BackButtonContainer>
                </PaddingContainer>
            </GameIntroBackground>
        </GameIntroContainer>
    );
};

export default GameIntro;
