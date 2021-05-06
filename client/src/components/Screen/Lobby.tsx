import { Button as MuiButton } from '@material-ui/core';
import { Assignment } from '@material-ui/icons';
import * as React from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { useParams } from 'react-router-dom';

import { IRouteParams } from '../../App';
import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { localDevelopment } from '../../utils/constants';
import { generateQRCode } from '../../utils/generateQRCode';
import Button from '../common/Button';
import { GAMES } from './data';
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
    StyledTypography,
    Subline,
    UpperSection,
    UpperSectionItem,
    UserListItem,
} from './Lobby.sc';

export const Lobby: React.FunctionComponent = () => {
    const { roomId, connectedUsers } = React.useContext(GameContext);
    const { playLobbyMusic, pauseLobbyMusic, permission } = React.useContext(AudioContext);
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext);
    const [selectedGame, setSelectedGame] = React.useState(0);
    const { id }: IRouteParams = useParams();
    const navigator = window.navigator;

    if (id && !screenSocket) {
        handleSocketConnection(id);
    }

    async function handleCopyToClipboard() {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(`${process.env.REACT_APP_FRONTEND_URL}${roomId}`);
        }
    }

    React.useEffect(() => {
        // TODO remove
        if (localDevelopment) {
            generateQRCode(`http://192.168.8.174:3000/${roomId}`, 'qrCode');
        } else {
            generateQRCode(`${process.env.REACT_APP_FRONTEND_URL}${roomId}`, 'qrCode');
        }
    }, [roomId]);

    React.useEffect(() => {
        playLobbyMusic(permission);
    }, [permission]);

    useBeforeunload(() => {
        //eslint-disable-next-line no-console
        pauseLobbyMusic(permission);
    });

    return (
        <LobbyContainer>
            <Headline>Room Code: {roomId}</Headline>
            <UpperSection>
                <UpperSectionItem>
                    <Subline>Connected Users</Subline>
                    <JoinedUsersView>
                        {connectedUsers?.map((user, index) => (
                            <UserListItem key={`LobbyScreen${roomId}${user.name}`}>
                                {index === 0 && <AdminIcon>👑</AdminIcon>}
                                <JoinedUser>{user.name}</JoinedUser>
                            </UserListItem>
                        ))}
                    </JoinedUsersView>
                </UpperSectionItem>
                <UpperSectionItem>
                    <StyledTypography>
                        This screen will later serve as a game board displaying the current game progress and your
                        smartphone will be used as a controller. To connect your phone, scan the QR code. Once your
                        phone is connected, your name should appear among the connected users. If all players are ready,
                        only player 1 will be able to start the game.
                    </StyledTypography>
                </UpperSectionItem>
                <UpperSectionItem>
                    <div id="qrCode" />
                    <MuiButton onClick={handleCopyToClipboard}>
                        Copy to Clipboard
                        <Assignment />
                    </MuiButton>
                </UpperSectionItem>
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
    );
};
