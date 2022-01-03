import React from 'react';

import sheep from '../../images/characters/singleSheep.png';
import shakeIt from '../../images/ui/shakeIt.svg';
import {
    ControlInstruction,
    ControlInstructionsContainer,
    ImagesContainer,
    ImageWrapper,
    InstructionImg,
    TextWrapper,
} from './ChooseGame.sc';

export const Game2Description: React.FunctionComponent = () => (
    <ControlInstructionsContainer>
        <ImagesContainer>
            <ImageWrapper>
                <InstructionImg src={shakeIt} />
            </ImageWrapper>
            <ImageWrapper>
                <InstructionImg src={sheep} />
            </ImageWrapper>
        </ImagesContainer>
        <TextWrapper>
            <ControlInstruction>Use the joystick on your phone to run!</ControlInstruction>
            <ControlInstruction>Catch the closest sheep by clicking on the button</ControlInstruction>
        </TextWrapper>
    </ControlInstructionsContainer>
);
