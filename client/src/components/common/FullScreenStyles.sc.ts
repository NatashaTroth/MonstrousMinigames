import styled from 'styled-components';

import forest from '../../images/ui/forest.svg';
import { OrangeBase } from './CommonStyles.sc';

export const FullScreenContainer = styled.div`
    background-size: cover;
    background-image: url(${forest});
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    background-repeat: no-repeat;
    background-position-x: -1px;
`;

const OrangeContainerBase = styled(OrangeBase)`
    display: flex;
    flex-direction: column;
    border-radius: 40px;
`;

export const ContentContainer = styled(OrangeContainerBase)`
    width: 80%;
    height: 70%;
    padding: 20px;
    margin-top: 80px;
`;

export const Headline = styled.div`
    font-weight: 700;
    font-size: 25px;
    margin-bottom: 20px;
    margin-top: 30px;
`;

export const ContentBase = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
`;

export const BackButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
    width: 80%;
    margin-left: 60px;
    margin-top: 20px;
`;
