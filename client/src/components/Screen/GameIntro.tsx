import { VolumeOff, VolumeUp } from '@material-ui/icons';
import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { handleAudio } from '../../domain/audio/handleAudio';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import history from '../../domain/history/history';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
import {
    BackButtonContainer, ControlInstruction, ControlInstructionsContainer, GameIntroBackground,
    GameIntroContainer, ImageDescription, IntroText, PaddingContainer, PreviewImageContainer
} from './GameIntro.sc';

const GameIntro: React.FunctionComponent = () => {
    const [showFirstIntro, setShowFirstIntro] = React.useState(true);
    const { roomId } = React.useContext(GameContext);
    const {
        playLobbyMusic,
        pauseLobbyMusic,
        audioPermission,
        playing,
        setAudioPermissionGranted,
        musicIsPlaying,
        initialPlayLobbyMusic,
    } = React.useContext(AudioContext);

    function handleSkip() {
        if (showFirstIntro) {
            setShowFirstIntro(false);
        } else {
            localStorage.setItem('tutorial', 'seen');
            history.push(`/screen/${roomId}/get-ready`);
        }
    }

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        initialPlayLobbyMusic(true);
    }, []);

    return (
        <GameIntroContainer>
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
                            Your goal is to be the first player to arrive at the goal while conquering your obsticles
                            along the way!
                        </ImageDescription>
                        <ControlInstructionsContainer>
                            <ControlInstruction>Shake your phone in order to run!</ControlInstruction>
                            <ControlInstruction>Rub your screen in order to slice the tree trunk!</ControlInstruction>
                            <ControlInstruction>oher obstacle</ControlInstruction>
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
