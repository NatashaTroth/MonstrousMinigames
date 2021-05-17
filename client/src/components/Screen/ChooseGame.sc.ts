import styled from 'styled-components';

import { secondary, secondaryShadow } from '../../utils/colors';

const boxShadowDepth = 7;

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
    width: 20%;
    margin-right: 20px;
    justify-content: space-between;

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
`;

export const PreviewImage = styled.img`
    display: flex;
    width: 100%;
`;

export const BackButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
    margin: 30px 0;
`;

export const OliverImage = styled.img`
    display: flex;
    width: 100%;
`;
