import { Grid } from '@material-ui/core';
import styled from 'styled-components';

import forest from '../../images/ui/forest.svg';

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
    align-items: center;
`;

export const ContentContainer = styled.div`
    width: 80%;
    height: 80%;
    display: flex;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    padding: 20px;
    border-radius: 40px;
    flex-direction: column;
    box-shadow: calc(${boxShadowDepth} * 1px) calc(${boxShadowDepth} * 1px) 0
        ${({ theme }) => theme.palette.secondary.dark};
`;

export const BackButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
`;

export const VolumeContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 40%;
    margin: 30px 0;
`;

export const StyledGridContainer = styled(Grid)`
    align-items: center;
`;
