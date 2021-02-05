import * as React from 'react'
import { GameContext } from '../../contexts/GameContextProvider'
import { Headline, JoinedUser, JoinedUsersView, LobbyContainer, Subline } from './Lobby.sc'

const Lobby: React.FunctionComponent = () => {
    const { roomId, connectedUsers } = React.useContext(GameContext)

    return (
        <LobbyContainer>
            <Headline>Room Code: {roomId}</Headline>
            <Subline>Connected Users</Subline>
            <JoinedUsersView>
                {connectedUsers?.map(user => (
                    <JoinedUser>{user.name}</JoinedUser>
                ))}
            </JoinedUsersView>
        </LobbyContainer>
    )
}

export default Lobby
