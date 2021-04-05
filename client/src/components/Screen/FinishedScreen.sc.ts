import styled from 'styled-components'

import { lightBlue, orange, progressBarGreen } from '../../utils/colors'

export const RankTable = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
`

export const FinishedScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: ${lightBlue};
`

export const FinishedScreenPlayerRank = styled.div`
    border: 5px solid ${orange};
    background: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
        'Helvetica Neue', sans-serif;
    color: ${orange};
    font-weight: 700;
    display: flex;
    width: 28%;
    font-size: 25px;
    flex-direction: column;
    text-align: center;
    box-shadow: 8px 8px 0 #888;
    border-radius: 4px;
    padding: 5px;
    text-align: left;
`
export const Headline = styled.div`
    color: black;
    font-weight: 700;
    font-size: 40px;
    margin-top: 30px;
    margin-bottom: 30px;
`
export const LeaderBoardRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`

interface IPlayerDifferenceProps {
    winner: boolean
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
`

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
`
