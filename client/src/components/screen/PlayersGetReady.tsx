/* eslint-disable react-hooks/exhaustive-deps */
import { Tooltip } from "@material-ui/core";
import * as React from "react";

import Button from "../../components/common/Button";
import { characters } from "../../config/characters";
import { GameNames } from "../../config/games";
import { ScreenStates } from "../../config/screenStates";
import { GameContext } from "../../contexts/GameContextProvider";
import { ScreenSocketContext } from "../../contexts/screen/ScreenSocketContextProvider";
import handleStartGame1 from "../../domain/game1/screen/gameState/handleStartGame1";
import handleStartGame2 from "../../domain/game2/screen/gameState/handleStartGame2";
import handleStartClickedGame3 from "../../domain/game3/screen/gameState/handleStartClickedGame3";
import history from "../../domain/history/history";
import { Socket } from "../../domain/socket/Socket";
import { MessageTypes } from "../../utils/constants";
import { Routes } from "../../utils/routes";
import { BackButtonContainer, FullScreenContainer } from "../common/FullScreenStyles.sc";
import { getUserArray } from "./Lobby";
import {
    Character, CharacterContainer, ConnectedUserCharacter, ConnectedUserContainer, ConnectedUsers,
    ConnectedUserStatus, Content, GetReadyBackground
} from "./PlayersGetReady.sc";

interface User {
    id: string;
    name: string;
    roomId: string;
    number: number;
    ready: boolean;
}

const PlayersGetReady: React.FC = () => {
    const { screenSocket } = React.useContext(ScreenSocketContext);
    const { roomId, connectedUsers, screenAdmin, screenState, chosenGame } = React.useContext(GameContext);

    const emptyGame = !connectedUsers || connectedUsers.length === 0;
    const usersReady =
        !connectedUsers || connectedUsers.filter((user: User) => user.ready).length === connectedUsers.length;

    React.useEffect(() => {
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

    const { canStart, message } = canStartGame(emptyGame, usersReady, connectedUsers, chosenGame);

    return (
        <FullScreenContainer>
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
                        <Tooltip title={message}>
                            <span>
                                <Button
                                    disabled={!canStart}
                                    onClick={() => {
                                        if (getUserArray(connectedUsers || []).length > 0 && chosenGame) {
                                            startGame(chosenGame!, screenSocket!);
                                        }
                                    }}
                                >
                                    Start
                                </Button>
                            </span>
                        </Tooltip>
                    )}
                </Content>
            </GetReadyBackground>
            <BackButtonContainer>{screenAdmin && <Button onClick={history.goBack}>Back</Button>}</BackButtonContainer>
        </FullScreenContainer>
    );
};

export default PlayersGetReady;

function startGame(game: GameNames, screenSocket: Socket) {
    switch (game) {
        case GameNames.game1:
            handleStartGame1(screenSocket);
            return;
        case GameNames.game2:
            handleStartGame2(screenSocket);
            return;
        case GameNames.game3:
            handleStartClickedGame3(screenSocket);
            return;
    }
}

export function canStartGame(
    emptyGame: boolean,
    usersReady: boolean,
    connectedUsers: User[] | undefined,
    chosenGame: GameNames | undefined
): { canStart: boolean; message: string } {
    if (chosenGame === GameNames.game3 && connectedUsers && connectedUsers.length >= 3) {
        if (!emptyGame && usersReady) return { canStart: true, message: '' };
        return { canStart: false, message: 'Not all users are ready yet' };
    } else if (chosenGame === GameNames.game3) {
        return { canStart: false, message: 'Three players are needed to play this game' };
    }

    if (!emptyGame && usersReady) return { canStart: true, message: '' };

    return { canStart: false, message: 'Not all users are ready yet' };
}
