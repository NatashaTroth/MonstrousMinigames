import styled from 'styled-components';

import forest from '../../images/forest.svg';
import introImg from '../../images/forest2.png';
import { secondary, secondaryShadow } from '../../utils/colors';

const boxShadowDepth = 7;

export const GameIntroContainer = styled.div`
    background-image: url(${forest});
    background-size: cover;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const GameIntroBackground = styled.div`
    background-color: ${secondary};
    border-radius: 40px;
    box-shadow: calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0 ${secondaryShadow};
    display: flex;
    width: 80%;
    height: 80%;
    flex-direction: column;
    justify-content: space-between;
`;

export const BackButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
`;

export const IntroText = styled.div`
    padding: 20px;
    padding: 20px;
`;

export const PaddingContainer = styled.div`
    padding: 20px;
`;

export const PreviewImageContainer = styled.div`
    margin-top: 40px;
    background-image: url(${introImg});
    width: 100%;
    height: 200px;
    background-repeat-y: repeat;
    background-size: contain;
`;

export const PreviewImage = styled.img`
    display: flex;
    width: 100%;
`;

export const ImageDescription = styled.div`
    background: ${secondaryShadow};
    color: white;
    font-size: 24px;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    font-weight: 600;
`;

export const ControlInstructionsContainer = styled.div`
    display: flex;
`;

export const ControlInstruction = styled.div`
    width: 33%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-top: 30px;
    font-size: 20px;
    font-weight: 400;
`;
