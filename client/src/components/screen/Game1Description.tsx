import React from 'react';
import styled from 'styled-components';

import mosquito from '../../images/mosquito.svg';
import spider from '../../images/obstacles/spider/spiderAlone.svg';
import stone from '../../images/obstacles/stone/stone.svg';
import foodCan from '../../images/obstacles/trash/foodCan.svg';
import wood from '../../images/obstacles/wood/wood.svg';
import attention from '../../images/ui/attention.png';
import pinwheel from '../../images/ui/pinwheel.svg';
import shakeIt from '../../images/ui/shakeIt.svg';
import {
    ControlInstruction,
    ControlInstructionsContainer,
    ImagesContainer,
    ImageWrapper,
    InstructionImg,
    TextWrapper,
} from './ChooseGame.sc';

export const Game1Description: React.FunctionComponent = () => (
    <ControlInstructionsContainer>
        <ImagesContainer>
            <ImageWrapper>
                <InstructionImg src={shakeIt} />
            </ImageWrapper>
            <ImageWrapper>
                <InstructionImg src={mosquito} />
            </ImageWrapper>
            <ImageWrapper>
                <InstructionImg src={attention} />
            </ImageWrapper>
        </ImagesContainer>
        <TextWrapper>
            <ControlInstruction>Shake your phone to run</ControlInstruction>
            <ControlInstruction>Don't get caught by the mosquito</ControlInstruction>
            <ControlInstruction>Look at your phone if this icon appears on screen</ControlInstruction>
        </TextWrapper>
    </ControlInstructionsContainer>
);

export const Game1Drawer: React.FunctionComponent = () => (
    <DrawerContainer>
        <Content>
            <Row>
                <ImagesContainer>
                    <ImageWrapper>
                        <InstructionImg src={wood} />
                    </ImageWrapper>
                    <ImageWrapper>
                        <InstructionImg src={spider} />
                    </ImageWrapper>
                    <ImageWrapper>
                        <InstructionImg src={foodCan} />
                    </ImageWrapper>
                </ImagesContainer>
                <TextWrapper>
                    <Instruction>Remove the tree trunk by cutting it along the line.</Instruction>
                    <Instruction>Blow into the microphone to get rid of the spider.</Instruction>
                    <Instruction>Put the right trash in the garbage can to get the forest clean again.</Instruction>
                </TextWrapper>
            </Row>
            <Row>
                <ImagesContainer>
                    <ImageWrapper>
                        <InstructionImg src={stone} />
                    </ImageWrapper>
                    <ImageWrapper>
                        <InstructionImg src={pinwheel} />
                    </ImageWrapper>
                </ImagesContainer>
                <TextWrapper>
                    <Instruction>
                        Tab on the rock to get a pebble. It can be used to stun the other players.
                    </Instruction>
                    <Instruction>Rotate the windmill when you're dead to speed up the chasers.</Instruction>
                </TextWrapper>
            </Row>
        </Content>
    </DrawerContainer>
);

const DrawerContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`;

const Content = styled.div`
    padding: 30px;
    display: flex;
    flex-direction: column;
    width: calc(100% - 60px);
    height: calc(100% - 60px);
`;

const Row = styled.div`
    display: flex;
    flex-direction: column;
    height: 50%;
`;

const Instruction = styled(ControlInstruction)`
    text-align: center;
`;
