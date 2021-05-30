import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import history from '../../domain/history/history';
import Button from '../common/Button';
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

    function handleSkip() {
        if (showFirstIntro) {
            setShowFirstIntro(false);
        } else {
            localStorage.setItem('tutorial', 'seen');
            history.push(`/screen/${roomId}/get-ready`);
        }
    }
    return (
        <GameIntroContainer>
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
