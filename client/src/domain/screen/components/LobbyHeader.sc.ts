import styled from 'styled-components';

import codeBackground from '../../../images/ui/codeBackground.svg';

export const HeadContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: baseline;
`;

export const RoomCodeContainer = styled.div`
    width: 100%;
    background-image: url(${codeBackground});
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    background-position: right;
`;

export const HeadContainerLeft = styled.div`
    display: flex;
    width: 100%;

    @media (min-width: 1060px) {
        width: 75%;
    }

    @media (min-width: 1200px) {
        width: 70%;
    }
`;

export const HeadContainerRight = styled.div`
    display: flex;
    width: 40%;
    justify-content: center;

    @media (min-width: 1060px) {
        width: 25%;
    }

    @media (min-width: 1200px) {
        width: 30%;
    }
`;

export const Headline = styled.div`
    font-size: 30px;
    color: black;
    padding: 0 30px;
`;

export const Code = styled.div`
    font-size: 30px;
    font-weight: 700;
    color: black;
    padding: 0 30px;
`;
