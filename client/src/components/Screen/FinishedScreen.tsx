import * as React from 'react'

import { GameContext } from '../../contexts/GameContextProvider'
import { formatMs } from '../../utils/formatMs'
import {
    FinishedScreenContainer,
    FinishedScreenPlayerRank,
    Headline,
    LeaderBoardRow,
    PlayerDifference,
    PlayerTime,
    RankTable,
    UnfinishedSectionHeadline,
    UnfinishedUserRow,
} from './FinishedScreen.sc'

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRanks, hasTimedOut } = React.useContext(GameContext)

    const unfinishedPlayers = playerRanks?.filter(playerRank => !playerRank.rank) || []
    const sortedPlayerRanks = playerRanks?.filter(playerRank => playerRank.rank).sort((a, b) => a.rank! - b.rank!)

    return (
        <FinishedScreenContainer>
            <RankTable>
                <Headline>{hasTimedOut ? 'Game has timed out!' : 'Finished!'}</Headline>
                {sortedPlayerRanks?.map((player, index) => (
                    <LeaderBoardRow key={`LeaderBoardRow${index}`}>
                        <FinishedScreenPlayerRank key={player.name}>
                            #{player.rank} {player.name}
                        </FinishedScreenPlayerRank>
                        <PlayerTime>{formatMs(player.totalTimeInMs!)}</PlayerTime>
                        <PlayerDifference winner={index === 0}>
                            {index === 0
                                ? `${formatMs(player.totalTimeInMs!)}`
                                : `+${formatMs(player.totalTimeInMs! - sortedPlayerRanks[0].totalTimeInMs!)}`}
                        </PlayerDifference>
                    </LeaderBoardRow>
                ))}
                {unfinishedPlayers?.length > 0 && (
                    <>
                        <UnfinishedSectionHeadline>Unfinished Players:</UnfinishedSectionHeadline>
                        {unfinishedPlayers.map((player, index) => (
                            <UnfinishedUserRow key={`UnfinishedLeaderBoardRow${index}`}>
                                <FinishedScreenPlayerRank key={player.name}>{player.name}</FinishedScreenPlayerRank>
                            </UnfinishedUserRow>
                        ))}
                    </>
                )}
            </RankTable>
        </FinishedScreenContainer>
    )
}
