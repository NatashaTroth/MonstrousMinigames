import styled from 'styled-components';

import forest from '../../images/ui/forest.svg';
import { Label } from '../common/Label.sc';

export const RankTable = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    margin-top: 60px;
`;

export const FinishedScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    background-image: url(${forest});
    background-size: cover;
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

export const PlayerTime = styled.div`
    border: 5px solid black;
    color: black;
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    font-weight: 700;
    display: flex;
    width: 28%;
    font-size: 25px;
    flex-direction: column;
    text-align: center;
    box-shadow: 8px 8px 0 #888;
    border-radius: 4px;
    padding: 5px;
    text-align: right;
`;

export const UnfinishedUserRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
`;
