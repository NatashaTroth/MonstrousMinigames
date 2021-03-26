import * as React from 'react'

import { GameContext } from '../../contexts/GameContextProvider'
import { formatMs } from '../../utils/formatMs'
import {
    FinishedScreenContainer,
    FinishedScreenPlayerRank,
    Headline,
    LeaderBoardRow,
    PlayerTime,
    RankTable,
} from './FinishedScreen.sc'

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRanks } = React.useContext(GameContext)

    const sortedPlayerRanks = playerRanks?.sort((a, b) => a.rank - b.rank)

    return (
        <FinishedScreenContainer>
            <RankTable>
                <Headline>Finished!</Headline>
                {sortedPlayerRanks?.map((player, index) => (
                    <LeaderBoardRow key={`LeaderBoardRow${index}`}>
                        <FinishedScreenPlayerRank key={player.name}>
                            #{player.rank} {player.name}{' '}
                        </FinishedScreenPlayerRank>
                        <PlayerTime winner={index === 0}>
                            {index === 0
                                ? formatMs(player.totalTimeInMs)
                                : `+${formatMs(player.totalTimeInMs - sortedPlayerRanks[0].totalTimeInMs)}`}
                        </PlayerTime>
                    </LeaderBoardRow>
                ))}
            </RankTable>
        </FinishedScreenContainer>
    )
}
