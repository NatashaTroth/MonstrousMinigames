import * as React from 'react'

import { GameContext } from '../../contexts/GameContextProvider'
import { formatMs } from '../../utils/formatMs'
import { FinishedScreenContainer, FinishedScreenText, Headline, RankTable } from './FinishedScreen.sc'

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRanks } = React.useContext(GameContext)

    const sortedPlayerRanks = playerRanks?.sort((a, b) => a.rank - b.rank)

    return (
        <FinishedScreenContainer>
            <RankTable>
                <Headline>Finished!</Headline>
                {sortedPlayerRanks?.map((player, index) => (
                    <FinishedScreenText key={player.name}>
                        #{player.rank} {player.name}{' '}
                        {formatMs(
                            index === 0
                                ? player.totalTimeInMs
                                : player.totalTimeInMs - sortedPlayerRanks[0].totalTimeInMs
                        )}
                    </FinishedScreenText>
                ))}
            </RankTable>
        </FinishedScreenContainer>
    )
}
