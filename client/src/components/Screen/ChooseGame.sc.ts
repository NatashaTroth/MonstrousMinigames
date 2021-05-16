import styled from 'styled-components';

import { secondary, secondaryShadow } from '../../utils/colors';

const boxShadowDepth = 7;

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const CloseButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
`;

export const DialogContent = styled.div`
    padding: 30px;
`;

export const GameSelectionContainer = styled.div`
    margin-bottom: 30px;
    display: flex;
    width: 100%;
    flex-direction: row;
`;

export const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 20%;
    margin-right: 20px;

    div:not(:last-child) {
        margin-bottom: 10px;
    }
`;

export const RightContainer = styled.div`
    width: 80%;
    height: 100%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;
export const GamePreviewContainer = styled.div`
    height: 100%;
    padding: 20px;
    background-color: ${secondary};
    border-radius: 10px;
    box-shadow: calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0 ${secondaryShadow};
`;

export const SelectGameButtonContainer = styled.div`
    margin-top: 20px;
    margin-bottom: 30px;
`;

export const PreviewImage = styled.img`
    display: flex;
    width: 100%;
`;

export const BackButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
`;
