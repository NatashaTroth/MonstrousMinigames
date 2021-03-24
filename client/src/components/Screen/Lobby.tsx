import * as React from 'react'

import { GameContext } from '../../contexts/GameContextProvider'
import { AdminIcon, Headline, JoinedUser, JoinedUsersView, LobbyContainer, Subline, UserListItem } from './Lobby.sc'

export const Lobby: React.FunctionComponent = () => {
    const { roomId, connectedUsers } = React.useContext(GameContext)

    return (
        <LobbyContainer>
            <Headline>Room Code: {roomId}</Headline>
            <Subline>Connected Users</Subline>
            <JoinedUsersView>
                {connectedUsers?.map((user, index) => (
                    <UserListItem key={`LobbyScreen${roomId}${user.name}`}>
                        {index === 0 && <AdminIcon>👑</AdminIcon>}
                        <JoinedUser>{user.name}</JoinedUser>
                    </UserListItem>
                ))}
            </JoinedUsersView>
        </LobbyContainer>
    )
}
