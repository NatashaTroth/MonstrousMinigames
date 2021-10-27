import styled from 'styled-components';

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
    justify-content: flex-end;

    @media (min-width: 1000px) {
        width: 75%;
    }
`;
export const GamePreviewContainer = styled.div`
    height: 100%;
    padding: 20px;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    border-radius: 10px;
    box-shadow: calc(${({ theme }) => theme.boxShadowDepth} * 1px) calc(${({ theme }) => theme.boxShadowDepth} * 1px) 0
        ${({ theme }) => theme.palette.secondary.dark};
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
    min-width: 200px;
`;
