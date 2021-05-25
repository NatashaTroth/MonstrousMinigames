import styled from 'styled-components';

import forest from '../../images/forest.svg';
import { secondary, secondaryShadow } from '../../utils/colors';

const boxShadowDepth = 7;

export const SettingsContainer = styled.div`
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
    background-image: url(${forest});
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
export const Headline = styled.div`
    font-weight: 700;
    font-size: 25px;
`;

export const Content = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
`;

export const ContentContainer = styled.div`
    width: 80%;
    height: 80%;
    display: flex;
    background-color: ${secondary};
    padding: 20px;
    border-radius: 40px;
    flex-direction: column;
    box-shadow: calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0 ${secondaryShadow};
`;

export const BackButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
`;
