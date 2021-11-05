import { Accordion, Typography } from '@material-ui/core';
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

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
`;

export const InstructionContainer = styled.div`
    width: 50%;
`;

export const SettingButtonSection = styled.div`
    div {
        margin-bottom: 20px;
    }
`;

export const LeftContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 60px 30px 30px 60px;
`;

export const RightContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    padding: 60px 30px 30px 60px;
`;

export const StyledAccordion = styled(Accordion)`
    background-color: ${({ theme }) => theme.palette.secondary.main};
    box-shadow: calc(${({ theme }) => theme.boxShadowDepth} * 1px) calc(${({ theme }) => theme.boxShadowDepth} * 1px) 0
        ${({ theme }) => theme.palette.secondary.dark};
`;

export const StyledHeadline = styled(Typography)`
    font-weight: 700;
    font-size: 16px;
`;

export const StyledText = styled(Typography)`
    font-size: 12px;
    line-height: 1.8;
`;
