import React from 'react';

import camera from '../../images/ui/camera.png';
import speech from '../../images/ui/speech.svg';
import vote from '../../images/ui/vote.svg';
import {
    ControlInstruction,
    ControlInstructionsContainer,
    ImagesContainer,
    ImageWrapper,
    InstructionImg,
    TextWrapper,
} from './ChooseGame.sc';

export const Game3Description: React.FunctionComponent = () => (
    <ControlInstructionsContainer>
        <ImagesContainer>
            <ImageWrapper>
                <InstructionImg src={camera} />
            </ImageWrapper>
            <ImageWrapper>
                <InstructionImg src={vote} />
            </ImageWrapper>
            <ImageWrapper>
                <InstructionImg src={speech} />
            </ImageWrapper>
        </ImagesContainer>
        <TextWrapper>
            <ControlInstruction>Upload a matching photo for the given word </ControlInstruction>
            <ControlInstruction>Vote for the picture you liked the most</ControlInstruction>
            <ControlInstruction>Prepare for presenting a short story about your pictures</ControlInstruction>
        </TextWrapper>
    </ControlInstructionsContainer>
);
