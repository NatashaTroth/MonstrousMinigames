import * as React from 'react'
import { GameContext } from '../../contexts/GameContextProvider'
import { FinishedScreenContainer, FinishedScreenText, Headline, RankTable } from './FinishedScreen.sc'

const FinishedScreen: React.FunctionComponent = () => {
    const { players } = React.useContext(GameContext)

    return (
        <FinishedScreenContainer>
            <RankTable>
                <Headline>Finished!</Headline>
                {players
                    ?.sort((a, b) => a.rank - b.rank)
                    .map(player => (
                        <FinishedScreenText>
                            #{player.rank} {player.name}
                        </FinishedScreenText>
                    ))}
            </RankTable>
        </FinishedScreenContainer>
    )
}

export default FinishedScreen
