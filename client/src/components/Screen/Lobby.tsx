import * as React from 'react'
import { useHistory } from 'react-router'

import { GameContext } from '../../contexts/GameContextProvider'
import instructionsImg1 from '../../images/instructions1.png'
import instructionsImg2 from '../../images/instructions2.png'
import Button from '../common/Button'
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

const GAMES = [
    {
        id: 1,
        name: 'Catch Food Game',
        instructions1: 'Shake your phone to move your monster',
        instructions2: 'When you reach an obstacle, look at your phone to see how to solve it',
        image1: instructionsImg1,
        image2: instructionsImg2,
    },
    { id: 2, name: 'Random Game' },
]
// const GAMES = ['Catch Food Game', 'Random Game']

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
                    <Button text={GAMES[0].name} onClick={() => setSelectedGame(0)}></Button>
                    <Button text={GAMES[1].name} onClick={() => setSelectedGame(1)}></Button>
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
                            history.push('/screen/game1?countdown=true')
                        }}
                    ></Button>
                </ImagesContainer>
            </GameChoiceContainer>
        </LobbyContainer>
    )
}
