import * as React from 'react'
import { useHistory } from 'react-router-dom'

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider'
import { GameContext } from '../../contexts/GameContextProvider'
import { PlayerContext } from '../../contexts/PlayerContextProvider'
import Button from '../common/Button'
import FullScreenContainer from '../common/FullScreenContainer'
import { AdminInstructions, Instruction, LobbyScreenContainer, StyledTypography } from './Lobby.sc'

export const Lobby: React.FunctionComponent = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext)
    const { isPlayerAdmin, permission } = React.useContext(PlayerContext)
    const { roomId } = React.useContext(GameContext)
    const history = useHistory()

    function startGame() {
        controllerSocket?.emit('message', {
            type: 'game1/start',
            roomId: sessionStorage.getItem('roomId'),
            userId: sessionStorage.getItem('userId'),
        })
        history.push(`/controller/${roomId}/game1`)
    }

    return (
        <FullScreenContainer>
            <LobbyScreenContainer>
                {isPlayerAdmin ? (
                    <AdminInstructions>
                        <Instruction>You are Player #1.</Instruction>
                        <StyledTypography>
                            When all other players are ready, you have to press the "Start Game" button to start the
                            game.
                        </StyledTypography>
                        <div>
                            <Button
                                onClick={() => {
                                    if (permission) {
                                        startGame()
                                    }
                                }}
                                text="Start Game"
                            />
                        </div>
                    </AdminInstructions>
                ) : (
                    <Instruction>{`Wait until Player #1 starts the Game`}</Instruction>
                )}
            </LobbyScreenContainer>
        </FullScreenContainer>
    )
}
