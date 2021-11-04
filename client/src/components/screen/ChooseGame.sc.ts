import styled from 'styled-components';

import gameDemo from '../../images/ui/gameDemo.png';

export const CloseButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
`;

export const DialogContent = styled.div`
    padding: 30px;
`;

export const GameSelectionContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    height: 100%;
    justify-content: space-between;
`;

export const Content = styled.div`
    width: 100%;
    align-content: center;
    display: flex;
    margin: 60px;
    margin-bottom: 0px;
    flex-direction: column;
`;

export const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    margin-right: 20px;
    justify-content: space-between;

    div:not(:last-child) {
        margin-bottom: 10px;
    }

    @media (min-width: 1000px) {
        width: 15%;
    }
`;

export const RightContainer = styled.div`
    width: 70%;
    height: 100%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (min-width: 1000px) {
        width: 75%;
    }
`;
export const GamePreviewContainer = styled.div`
    width: 100%;
    height: 90%;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    border-radius: 10px;
    box-shadow: calc(${({ theme }) => theme.boxShadowDepth} * 1px) calc(${({ theme }) => theme.boxShadowDepth} * 1px) 0
        ${({ theme }) => theme.palette.secondary.dark};
`;

export const SelectGameButtonContainer = styled.div`
    margin: 20px 0;
`;

export const BackButtonContainer = styled.div`
    display: flex;
    width: 100%;
    margin: 60px 0 30px 0;
`;

export const OliverImage = styled.img`
    display: flex;
    width: 100%;
    min-width: 200px;
`;

export const PreviewImageContainer = styled.div`
    margin-top: 30px;
    background-image: url(${gameDemo});
    width: 100%;
    height: 30%;
    background-size: cover;
    background-position: bottom;
`;

export const ImageDescription = styled.div`
    background: ${({ theme }) => theme.palette.secondary.dark};
    color: white;
    font-size: 18px;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    font-weight: 600;
`;

export const ControlInstructionsContainer = styled.div`
    display: flex;
    justify-content: space-around;
`;

export const ControlInstruction = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 10px 0;
    font-size: 14px;
    font-weight: 400;
    width: 100%;
`;

export const InstructionImg = styled.img`
    display: flex;
    width: 60%;
    margin-top: 20px;
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 18%;
`;
