import * as React from 'react'

import { GameContext } from '../../contexts/GameContextProvider'
import instructionsImg1 from '../../images/instructions1.png'
import instructionsImg2 from '../../images/instructions2.png'
import Button from '../common/Button'
import {
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
    const { roomId, connectedUsers } = React.useContext(GameContext)
    const [selectedGame, setSelectedGame] = React.useState(0)

    return (
        <LobbyContainer>
            <Headline>Room Code: {roomId}</Headline>
            <Subline>Connected Users</Subline>
            <JoinedUsersView>
                {connectedUsers?.map(user => (
                    <JoinedUser key={`LobbyScreen${roomId}${user.name}`}>{user.name}</JoinedUser>
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
                    {/* <Button text="Start game"></Button> */}
                </ImagesContainer>
            </GameChoiceContainer>
        </LobbyContainer>
    )
}
