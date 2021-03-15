import * as React from 'react'
import { FinishedScreenContainer, FinishedScreenText } from './FinishedScreen.sc'
import { PlayerContext } from '../../contexts/PlayerContextProvider'
import FullScreenContainer from '../common/FullScreenContainer'

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRank } = React.useContext(PlayerContext)

    return (
        <FullScreenContainer>
            <FinishedScreenContainer>
                <FinishedScreenText>
                    #{playerRank}
                    <br />
                    Finished!
                </FinishedScreenText>
            </FinishedScreenContainer>
        </FullScreenContainer>
    )
}
