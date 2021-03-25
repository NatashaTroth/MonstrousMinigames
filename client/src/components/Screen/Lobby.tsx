import * as React from 'react'
import { useHistory } from 'react-router'

import { GameContext } from '../../contexts/GameContextProvider'
import Button from '../common/Button'
import { GAMES } from './data'
import {
    AdminIcon,
    GameChoiceContainer,
    Headline,
    ImagesContainer,
    Instructions,
    InstructionsImg,
    JoinedUser,
    JoinedUsersView,
    ListOfGames,
    LobbyContainer,
    Subline,
    UserListItem,
} from './Lobby.sc'

export const Lobby: React.FunctionComponent = () => {
    const history = useHistory()
    const { roomId, connectedUsers } = React.useContext(GameContext)
    const [selectedGame, setSelectedGame] = React.useState(0)

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
            <GameChoiceContainer>
                <ListOfGames>
                    {GAMES.map(game => (
                        <Button
                            key={`LobbySelectGame${game.name}Button`}
                            text={game.name}
                            onClick={() => setSelectedGame(game.id)}
                        />
                    ))}
                </ListOfGames>
                <ImagesContainer>
                    <div>
                        <InstructionsImg src={GAMES[selectedGame].image1} alt="Instructions" />
                        <Instructions>{GAMES[selectedGame].instructions1}</Instructions>
                        <InstructionsImg src={GAMES[selectedGame].image2} alt="Instructions" />
                        <Instructions>{GAMES[selectedGame].instructions2}</Instructions>
                    </div>
                    <Button
                        text="Start game"
                        onClick={() => {
                            history.push(`/screen/${roomId}/game1`)
                        }}
                    ></Button>
                </ImagesContainer>
            </GameChoiceContainer>
        </LobbyContainer>
    )
}
