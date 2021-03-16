import * as React from 'react'

import { PlayerContext } from '../../contexts/PlayerContextProvider'
import FullScreenContainer from '../common/FullScreenContainer'
import { FinishedScreenContainer, FinishedScreenText } from './FinishedScreen.sc'

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
