import * as React from 'react'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'

import { IRouteParams } from '../../App'
import { GameContext } from '../../contexts/GameContextProvider'
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider'
import { STAGING } from '../../utils/config'
import { generateQRCode } from '../../utils/generateQRCode'
import Button from '../common/Button'
import { GAMES } from './data'
import {
    AdminIcon,
    ConnectedUsers,
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
    UpperSection,
    UserListItem,
} from './Lobby.sc'

export const Lobby: React.FunctionComponent = () => {
    const history = useHistory()
    const { roomId, connectedUsers } = React.useContext(GameContext)
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext)
    const [selectedGame, setSelectedGame] = React.useState(0)
    const { id }: IRouteParams = useParams()

    if (id && !screenSocket) {
        handleSocketConnection(id)
    }

    React.useEffect(() => {
        generateQRCode(`${STAGING}${roomId}`, 'qrCode')
    }, [roomId])

    return (
        <LobbyContainer>
            <Headline>Room Code: {roomId}</Headline>
            <UpperSection>
                <ConnectedUsers>
                    <Subline>Connected Users</Subline>
                    <JoinedUsersView>
                        {connectedUsers?.map((user, index) => (
                            <UserListItem key={`LobbyScreen${roomId}${user.name}`}>
                                {index === 0 && <AdminIcon>👑</AdminIcon>}
                                <JoinedUser>{user.name}</JoinedUser>
                            </UserListItem>
                        ))}
                    </JoinedUsersView>
                </ConnectedUsers>
                <div id="qrCode" />
            </UpperSection>

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
