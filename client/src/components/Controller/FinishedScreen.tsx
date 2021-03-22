import * as React from 'react'
import { useHistory } from 'react-router-dom'

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider'
import { GameContext } from '../../contexts/GameContextProvider'
import { PlayerContext } from '../../contexts/PlayerContextProvider'
import Button from '../common/Button'
import FullScreenContainer from '../common/FullScreenContainer'
import { FinishedScreenContainer, FinishedScreenText } from './FinishedScreen.sc'

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRank } = React.useContext(PlayerContext)
    const { isPlayerAdmin } = React.useContext(PlayerContext)
    const { controllerSocket } = React.useContext(ControllerSocketContext)
    const { finished } = React.useContext(GameContext)
    const history = useHistory()

    function handleRestartGame() {
        controllerSocket?.emit('message', { type: 'resetGame' })
        history.push('/controller/lobby')
    }

    return (
        <FullScreenContainer>
            <FinishedScreenContainer>
                <FinishedScreenText>
                    #{playerRank}
                    <span>Finished!</span>
                </FinishedScreenText>
                {finished && isPlayerAdmin && <Button onClick={handleRestartGame} text="Restart Game" />}
            </FinishedScreenContainer>
        </FullScreenContainer>
    )
}
