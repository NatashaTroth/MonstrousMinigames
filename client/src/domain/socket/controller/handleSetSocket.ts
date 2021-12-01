import { History } from 'history';

import { GameNames } from '../../../config/games';
import { FinalPhoto, Topic, Vote, VoteResult } from '../../../contexts/game3/Game3ContextProvider';
import { controllerChooseCharacterRoute } from '../../../utils/routes';
import { HandleGameHasFinishedMessageData } from '../../commonGameState/controller/handleGameHasFinishedMessage';
import { HandleGameStartedData } from '../../commonGameState/controller/handleGameStartedMessage';
import { HandlePlayerFinishedProps } from '../../commonGameState/controller/handlePlayerFinishedMessage';
import { HandleObstacleMessageProps } from '../../game1/controller/gameState/handleObstacleMessage';
import { HandlePlayerDiedProps } from '../../game1/controller/gameState/handlePlayerDied';
import { handleSetControllerSocketGame1 } from '../../game1/controller/socket/Sockets';
import { handleSetControllerSocketGame3 } from '../../game3/controller/socket/Sockets';
import { handleSetCommonSocketsGame3 } from '../../game3/socket/Socket';
import { MessageSocket } from '../../socket/MessageSocket';
import { Socket } from '../../socket/Socket';
import { ConnectedUsersMessage, connectedUsersTypeGuard } from '../../typeGuards/connectedUsers';
import { ErrorMessage, errorTypeGuard } from '../../typeGuards/error';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../typeGuards/finished';
import { ApproachingSolvableObstacleMessage } from '../../typeGuards/game1/approachingSolvableObstacleTypeGuard';
import { GameHasStartedMessage, startedTypeGuard } from '../../typeGuards/game1/started';
import { StunnablePlayersMessage } from '../../typeGuards/game1/stunnablePlayers';
import { GameSetMessage, gameSetTypeGuard } from '../../typeGuards/gameSet';
import { GameHasPausedMessage, pausedTypeGuard } from '../../typeGuards/paused';
import { GameHasResetMessage, resetTypeGuard } from '../../typeGuards/reset';
import { GameHasResumedMessage, resumedTypeGuard } from '../../typeGuards/resumed';
import { GameHasStoppedMessage, stoppedTypeGuard } from '../../typeGuards/stopped';
import { UserInitMessage, userInitTypeGuard } from '../../typeGuards/userInit';

export interface HandleSetSocketDependencies {
    history: History;
    setControllerSocket: (socket: Socket) => void;
    setHasPaused: (val: boolean) => void;
    setExceededChaserPushes: (val: boolean) => void;
    setChosenGame: (val: GameNames) => void;
    setVoteForPhotoMessage: (val: Vote) => void;
    setRoundIdx: (roundIdx: number) => void;
    setTopicMessage: (val: Topic) => void;
    setVotingResults: (val: VoteResult) => void;
    setFinalRoundCountdownTime: (time: number) => void;
    setPresentFinalPhotos: (val: FinalPhoto) => void;
    handleUserInitMessage: (data: UserInitMessage) => void;
    handleConnectedUsersMessage: (data: ConnectedUsersMessage) => void;
    handleGameStartedMessage: (data: HandleGameStartedData) => void;
    handleGameHasStoppedMessage: (roomId: string) => void;
    handleGameHasFinishedMessage: (data: HandleGameHasFinishedMessageData) => void;
    handleObstacleMessage: (data: HandleObstacleMessageProps) => void;
    handlePlayerFinishedMessage: (data: HandlePlayerFinishedProps) => void;
    handleStunnablePlayers: (data: StunnablePlayersMessage) => void;
    handlePlayerDied: (data: HandlePlayerDiedProps) => void;
    handleGameHasResetMessage: (roomId: string) => void;
    handleApproachingObstacleMessage: (data: ApproachingSolvableObstacleMessage) => void;
}

export function handleSetSocket(
    socket: Socket,
    roomId: string,
    playerFinished: boolean,
    dependencies: HandleSetSocketDependencies
) {
    const {
        history,
        setControllerSocket,
        setHasPaused,
        setChosenGame,
        setVoteForPhotoMessage,
        setRoundIdx,
        setTopicMessage,
        setVotingResults,
        setFinalRoundCountdownTime,
        setPresentFinalPhotos,
        handleUserInitMessage,
        handleConnectedUsersMessage,
        handleGameStartedMessage,
        handleGameHasStoppedMessage,
        handleGameHasFinishedMessage,
        handleGameHasResetMessage,
    } = dependencies;

    setControllerSocket(socket);

    const userInitSocket = new MessageSocket(userInitTypeGuard, socket);
    const startedSocket = new MessageSocket(startedTypeGuard, socket);
    const pausedSocket = new MessageSocket(pausedTypeGuard, socket);
    const resumedSocket = new MessageSocket(resumedTypeGuard, socket);
    const stoppedSocket = new MessageSocket(stoppedTypeGuard, socket);
    const resetSocket = new MessageSocket(resetTypeGuard, socket);
    const errorSocket = new MessageSocket(errorTypeGuard, socket);
    const connectedUsersSocket = new MessageSocket(connectedUsersTypeGuard, socket);
    const gameFinishedSocket = new MessageSocket(finishedTypeGuard, socket);
    const gameSetSocket = new MessageSocket(gameSetTypeGuard, socket);

    userInitSocket.listen((data: UserInitMessage) => {
        handleUserInitMessage(data);
    });

    startedSocket.listen((data: GameHasStartedMessage) =>
        handleGameStartedMessage({
            roomId,
            game: data.game,
            countdownTime: data.countdownTime,
        })
    );

    // TODO remove when phaser is ready
    pausedSocket.listen((data: GameHasPausedMessage) => {
        setHasPaused(true);
    });

    resumedSocket.listen((data: GameHasResumedMessage) => {
        setHasPaused(false);
    });

    stoppedSocket.listen((data: GameHasStoppedMessage) => {
        handleGameHasStoppedMessage(roomId);
    });

    resetSocket.listen((data: GameHasResetMessage) => {
        handleGameHasResetMessage(roomId);
    });

    errorSocket.listen((data: ErrorMessage) => {
        // TODO handle errors
    });

    connectedUsersSocket.listen((data: ConnectedUsersMessage) => {
        handleConnectedUsersMessage(data);
    });

    gameFinishedSocket.listen((data: GameHasFinishedMessage) => {
        handleGameHasFinishedMessage({
            roomId,
            playerRanks: data.data.playerRanks,
        });
    });

    handleSetControllerSocketGame1(socket, roomId, playerFinished, dependencies);

    handleSetCommonSocketsGame3(socket, {
        setTopicMessage,
        setVoteForPhotoMessage,
        setFinalRoundCountdownTime,
        setVotingResults,
    });
    handleSetControllerSocketGame3(socket, {
        setVoteForPhotoMessage,
        setRoundIdx,
        setVotingResults,
        setPresentFinalPhotos,
    });

    gameSetSocket.listen((data: GameSetMessage) => setChosenGame(data.game));

    history.push(controllerChooseCharacterRoute(roomId));
}
