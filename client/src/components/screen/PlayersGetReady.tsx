/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

import Button from '../../components/common/Button';
import { characters } from '../../config/characters';
import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext, User } from '../../contexts/ScreenSocketContextProvider';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import handleStartGame1 from '../../domain/game1/screen/gameState/handleStartGame1';
import handleStartGame2 from '../../domain/game2/screen/gameState/handleStartGame2';
import handleStartGame3 from '../../domain/game3/screen/gameState/handleStartGame3';
import history from '../../domain/history/history';
import { Socket } from '../../domain/socket/Socket';
import { MessageTypes } from '../../utils/constants';
import { GameNames } from '../../utils/games';
import { Routes } from '../../utils/routes';
import { ScreenStates } from '../../utils/screenStates';
import { getUserArray } from './Lobby';
import {
    Character,
    CharacterContainer,
    ConnectedUserCharacter,
    ConnectedUserContainer,
    ConnectedUsers,
    ConnectedUserStatus,
    Content,
    GetReadyBackground,
    GetReadyContainer,
} from './PlayersGetReady.sc';

const PlayersGetReady: React.FC = () => {
    const { screenSocket } = React.useContext(ScreenSocketContext);
    const { audioPermission, setAudioPermissionGranted, initialPlayLobbyMusic } = React.useContext(AudioContext);
    const { roomId, connectedUsers, screenAdmin, screenState, chosenGame } = React.useContext(GameContext);

    const emptyGame = !connectedUsers || connectedUsers.length === 0;
    const usersReady =
        !connectedUsers ||
        connectedUsers.filter((user: User) => {
            return user.ready;
        }).length === connectedUsers.length;

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        initialPlayLobbyMusic(true);
        if (screenAdmin) {
            screenSocket?.emit({
                type: MessageTypes.screenState,
                state: ScreenStates.getReady,
            });
        }
    }, []);

    React.useEffect(() => {
        if (!screenAdmin && screenState !== ScreenStates.getReady) {
            history.push(`${Routes.screen}/${roomId}/${screenState}`);
        }
    }, [screenState]);

    return (
        <GetReadyContainer>
            <GetReadyBackground>
                <Content>
                    <ConnectedUsers>
                        {getUserArray(connectedUsers || []).map((user, index) => (
                            <ConnectedUserContainer key={`LobbyScreen${roomId}${user.number}`}>
                                <ConnectedUserCharacter number={user.number} free={user.free}>
                                    <CharacterContainer>
                                        {!user.free && user.characterNumber !== -1 && (
                                            <Character src={characters[Number(user.characterNumber)].src} />
                                        )}
                                    </CharacterContainer>

                                    {user.free ? `Player ${user.number}` : user.name}
                                </ConnectedUserCharacter>
                                <ConnectedUserStatus number={user.number} free={user.free}>
                                    {!user.free && (user.ready ? 'Ready' : 'Not Ready')}
                                    {user.free && user.name}
                                </ConnectedUserStatus>
                            </ConnectedUserContainer>
                        ))}
                    </ConnectedUsers>
                    {screenAdmin && (
                        <Button
                            disabled={emptyGame || !usersReady}
                            onClick={() => {
                                if (getUserArray(connectedUsers || []).length > 0 && chosenGame) {
                                    startGame(chosenGame!, screenSocket!);
                                }
                            }}
                        >
                            Start
                        </Button>
                    )}
                </Content>
            </GetReadyBackground>
        </GetReadyContainer>
    );
};

export default PlayersGetReady;

function startGame(gameId: GameNames, screenSocket: Socket) {
    switch (gameId) {
        case GameNames.game1:
            handleStartGame1(screenSocket);
            return;
        case GameNames.game2:
            handleStartGame2(screenSocket);
            return;
        case GameNames.game3:
            handleStartGame3(screenSocket);
            return;
    }
}
