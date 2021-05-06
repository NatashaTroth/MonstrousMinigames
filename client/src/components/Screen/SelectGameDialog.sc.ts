import styled from 'styled-components';

import { disabledBackground, Player2 } from '../../utils/colors';

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
`;

export const RightContainer = styled.div`
    width: 80%;
    height: 100%;
`;
export const GamePreviewContainer = styled.div`
    background-color: ${Player2};
    border-radius: 10px;
    height: 100%;
    padding: 20px;
`;

interface SelectGameButton {
    disabled?: boolean;
    selected?: boolean;
}

export const SelectGameButton = styled.div<SelectGameButton>`
    display: flex;
    padding: 5px 20px;
    justify-content: center;
    margin-bottom: 10px;
    font-size: 18px;
    white-space: nowrap;
    border-radius: 10px;
    cursor: pointer;
    background-color: ${({ selected, disabled }) => (disabled ? disabledBackground : selected ? Player2 : 'red')};
`;

export const SelectGameButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
`;

export const PreviewImage = styled.img`
    display: flex;
    width: 100%;
`;
