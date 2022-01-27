import styled from 'styled-components';

import { Label } from '../common/Label.sc';

export const RankTable = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    margin-top: 60px;
`;

export const Headline = styled(Label)`
    font-size: 40px;
    margin-top: 30px;
    margin-bottom: 30px;
`;

export const LeaderBoardRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`;

export const UnfinishedUserRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
`;
