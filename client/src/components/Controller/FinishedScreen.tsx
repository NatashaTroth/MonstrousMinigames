import * as React from 'react'
import { FinishedScreenContainer, FinishedScreenText } from './FinishedScreen.sc'
import { PlayerContext } from '../../contexts/PlayerContextProvider'

const FinishedScreen: React.FunctionComponent = () => {
    const { playerRank } = React.useContext(PlayerContext)

    return (
        <FinishedScreenContainer>
            <FinishedScreenText>
                #{playerRank}
                <br />
                Finished!
            </FinishedScreenText>
        </FinishedScreenContainer>
    )
}

export default FinishedScreen
