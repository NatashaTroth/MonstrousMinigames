import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import history from '../../domain/history/history';
import game1Img from '../../images/instructions1.png';
import oliverLobby from '../../images/oliverLobby.svg';
import Button from '../common/Button';
import Logo from '../common/Logo';
import {
    BackButtonContainer,
    Content,
    GamePreviewContainer,
    GameSelectionContainer,
    LeftContainer,
    OliverImage,
    PreviewImage,
    RightContainer,
    SelectGameButtonContainer,
} from './ChooseGame.sc';
import {
    HeadContainer,
    HeadContainerLeft,
    HeadContainerRight,
    Headline,
    LobbyContainer,
    RoomCodeContainer,
} from './Lobby.sc';

const ChooseGame: React.FunctionComponent = () => {
    const [selectedGame, setSelectedGame] = React.useState(0);
    const { roomId } = React.useContext(GameContext);

    const games = [
        {
            id: 1,
            name: 'Game 1',
            image: game1Img,
        },
        { id: 2, name: 'Game 2' },
        { id: 3, name: 'Game 3' },
        { id: 4, name: 'Game 4' },
    ];

    return (
        <LobbyContainer>
            <Content>
                <HeadContainer>
                    <HeadContainerLeft>
                        <RoomCodeContainer>
                            <Headline>Room Code: {roomId}</Headline>
                        </RoomCodeContainer>
                    </HeadContainerLeft>
                    <HeadContainerRight>
                        <Logo />
                    </HeadContainerRight>
                </HeadContainer>

                <GameSelectionContainer>
                    <LeftContainer>
                        <div>
                            {games.map((game, index) => (
                                <Button
                                    key={game.name}
                                    variant={index === selectedGame ? 'secondary' : 'primary'}
                                    disabled={index !== 0}
                                    onClick={() => index === 0 && setSelectedGame(game.id)}
                                >
                                    {game.name}
                                </Button>
                            ))}
                        </div>
                        <OliverImage src={oliverLobby} />
                    </LeftContainer>
                    <RightContainer>
                        <GamePreviewContainer>
                            <PreviewImage src={games[selectedGame].image} />
                        </GamePreviewContainer>
                        <SelectGameButtonContainer>
                            <Button
                                variant="secondary"
                                onClick={() => history.push(`/screen/${roomId}/game-intro`)}
                                fullwidth
                            >{`Start ${games[selectedGame].name}`}</Button>
                        </SelectGameButtonContainer>
                        <BackButtonContainer>
                            <Button onClick={() => history.push(`/screen/${roomId}/lobby`)}>Back</Button>
                        </BackButtonContainer>
                    </RightContainer>
                </GameSelectionContainer>
            </Content>
        </LobbyContainer>
    );
};

export default ChooseGame;
