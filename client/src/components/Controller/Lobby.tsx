import * as React from 'react'
import { useHistory } from 'react-router-dom'

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider'
import { GameContext } from '../../contexts/GameContextProvider'
import { PlayerContext } from '../../contexts/PlayerContextProvider'
import Button from '../common/Button'
import FullScreenContainer from '../common/FullScreenContainer'
import { Instruction, LobbyScreenContainer } from './Lobby.sc'

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
                    <Button
                        onClick={() => {
                            if (permission) {
                                startGame()
                            }
                        }}
                        text="Start Game"
                    />
                ) : (
                    <Instruction>Wait until the Admin starts the Game</Instruction>
                )}
            </LobbyScreenContainer>
        </FullScreenContainer>
    )
}
