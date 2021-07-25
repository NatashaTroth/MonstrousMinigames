import styled from 'styled-components';

import fire from '../../images/ui/fire.svg';

export const ConnectScreenContainer = styled.div`
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-position: bottom;
    background-image: url(${fire});
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const LeftButtonContainer = styled.div`
    div:not(:last-child) {
        margin-bottom: 20px;
    }
`;

export const ButtonContainer = styled.div`
    div:first-child {
        margin-bottom: 20px;
    }
`;

export const LeftContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 60px;
`;

export const RightContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    padding: 60px;
`;
