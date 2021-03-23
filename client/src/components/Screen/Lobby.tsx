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

export const Lobby: React.FunctionComponent = () => {
    const { roomId, connectedUsers } = React.useContext(GameContext)
    // const [selectedGame, setSelectedGame] = React.useState(1)

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
                    <Button text="Catch Food Game"></Button>
                    {/* <Button text="Random Game 2"></Button> */}
                </ListOfGames>
                <ImagesContainer>
                    <div>
                        <InstructionsImg src={instructionsImg1} alt="Instructions" />
                        <Instructions>Shake your phone to move your monster</Instructions>
                        <InstructionsImg src={instructionsImg2} alt="Instructions" />
                        <Instructions>
                            When you reach an obstacle, look at your phone to see how to solve it
                        </Instructions>
                    </div>
                    <Button text="Start game"></Button>
                </ImagesContainer>
            </GameChoiceContainer>
        </LobbyContainer>
    )
}
