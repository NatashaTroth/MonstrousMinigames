import * as React from 'react'

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider'
import { GameContext } from '../../contexts/GameContextProvider'
import { PlayerContext } from '../../contexts/PlayerContextProvider'
import Button from '../common/Button'
import FullScreenContainer from '../common/FullScreenContainer'
import { FinishedScreenContainer, FinishedScreenText } from './FinishedScreen.sc'

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRank, isPlayerAdmin, resetPlayer } = React.useContext(PlayerContext)
    const { resetGame } = React.useContext(GameContext)
    const { controllerSocket } = React.useContext(ControllerSocketContext)

    function handlePlayAgain() {
        controllerSocket?.emit('message', { type: 'resetGame' })
        resetGame()
        resetPlayer()
    }

    return (
        <FullScreenContainer>
            <FinishedScreenContainer>
                <FinishedScreenText>
                    #{playerRank}
                    <span>Finished!</span>
                </FinishedScreenText>
                {/* TODO check if all players are finished */}
                {isPlayerAdmin && <Button onClick={handlePlayAgain} text="Play Again" />}
            </FinishedScreenContainer>
        </FullScreenContainer>
    )
}
