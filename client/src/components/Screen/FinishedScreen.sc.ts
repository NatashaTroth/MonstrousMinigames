import styled from 'styled-components';

import forest from '../../images/forest.svg';
import { progressBarGreen } from '../../utils/colors';
import { Label } from '../common/Label.sc';

export const RankTable = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
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

interface IPlayerDifferenceProps {
    winner: boolean;
}

export const PlayerDifference = styled.div<IPlayerDifferenceProps>`
    border: 5px solid ${({ winner }) => (winner ? progressBarGreen : 'red')};
    color: ${({ winner }) => (winner ? progressBarGreen : 'red')};
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
