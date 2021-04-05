import { Button as MuiButton } from '@material-ui/core'
import { Assignment } from '@material-ui/icons'
import * as React from 'react'
import { useParams } from 'react-router-dom'

import { IRouteParams } from '../../App'
import { GameContext } from '../../contexts/GameContextProvider'
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider'
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
    const { roomId, connectedUsers } = React.useContext(GameContext)
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext)
    const [selectedGame, setSelectedGame] = React.useState(0)
    const { id }: IRouteParams = useParams()
    const navigator = window.navigator

    if (id && !screenSocket) {
        handleSocketConnection(id)
    }

    async function handleCopyToClipboard() {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(`${process.env.REACT_APP_FRONTEND_URL}${roomId}`)
        }
    }

    React.useEffect(() => {
        generateQRCode(`${process.env.REACT_APP_FRONTEND_URL}${roomId}`, 'qrCode')
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
                <div>
                    <div id="qrCode" />
                    <MuiButton onClick={handleCopyToClipboard}>
                        Copy to Clipboard
                        <Assignment />
                    </MuiButton>
                </div>
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
                    </div>
                </ImagesContainer>
            </GameChoiceContainer>
        </LobbyContainer>
    )
}
