import { History } from 'history';

import { GameNames } from '../../../config/games';
import { FinalPhoto, Topic, Vote, VoteResult } from '../../../contexts/game3/Game3ContextProvider';
import { Routes } from '../../../utils/routes';
import { HandleGameHasFinishedMessage } from '../../commonGameState/screen/handleGameHasFinishedMessage';
import { HandleGameStartedProps } from '../../commonGameState/screen/handleGameStartedMessage';
import { handleSetScreenSocketGame3 } from '../../game3/screen/socket/Sockets';
import { handleSetCommonSocketsGame3 } from '../../game3/socket/Socket';
import { MessageSocket } from '../../socket/MessageSocket';
import ScreenSocket from '../../socket/screenSocket';
import { Socket } from '../../socket/Socket';
import { ConnectedUsersMessage, connectedUsersTypeGuard } from '../../typeGuards/connectedUsers';
import { ErrorMessage, errorTypeGuard } from '../../typeGuards/error';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../typeGuards/finished';
import { GameHasStartedMessage, startedTypeGuard } from '../../typeGuards/game1/started';
import { GameSetMessage, gameSetTypeGuard } from '../../typeGuards/gameSet';
import { pausedTypeGuard } from '../../typeGuards/paused';
import { resetTypeGuard } from '../../typeGuards/reset';
import { resumedTypeGuard } from '../../typeGuards/resumed';
import { ScreenAdminMessage, screenAdminTypeGuard } from '../../typeGuards/screenAdmin';
import { ScreenStateMessage, screenStateTypeGuard } from '../../typeGuards/screenState';
import { StartPhaserGameMessage, startPhaserGameTypeGuard } from '../../typeGuards/startPhaserGame';
import { StartSheepGameMessage, startSheepGameTypeGuard } from '../../typeGuards/startSheepGame';
import { stoppedTypeGuard } from '../../typeGuards/stopped';

export interface HandleSetSocketDependencies {
    setScreenSocket: (socket: Socket) => void;
    setHasPaused: (val: boolean) => void;
    setScreenAdmin: (val: boolean) => void;
    setScreenState: (val: string) => void;
    setChosenGame: (val: GameNames) => void;
    setTopicMessage: (val: Topic) => void;
    setVoteForPhotoMessage: (val: Vote) => void;
    setVotingResults: (val: VoteResult) => void;
    setRoundIdx: (roundIdx: number) => void;
    setFinalRoundCountdownTime: (val: number) => void;
    setPresentFinalPhotos: (val: FinalPhoto) => void;
    history: History;
    handleGameHasFinishedMessage: (props: HandleGameHasFinishedMessage) => void;
    handleConnectedUsersMessage: (data: ConnectedUsersMessage) => void;
    handleStartPhaserGameMessage: (roomId: string) => void;
    handleStartSheepGameMessage: (roomId: string) => void;
    handleGameHasStoppedMessage: (roomId: string) => void;
    handleGameHasResetMessage: (roomId: string) => void;
    handleGameStartedMessage: (props: HandleGameStartedProps) => void;
}

export function handleSetSocket(
    socket: Socket,
    roomId: string,
    dependencies: HandleSetSocketDependencies,
    route?: string
) {
    const {
        setScreenSocket,
        setHasPaused,
        setScreenAdmin,
        setScreenState,
        setChosenGame,
        setTopicMessage,
        setRoundIdx,
        setVoteForPhotoMessage,
        setVotingResults,
        setFinalRoundCountdownTime,
        setPresentFinalPhotos,
        history,
        handleGameHasFinishedMessage,
        handleConnectedUsersMessage,
        handleStartPhaserGameMessage,
        handleStartSheepGameMessage,
        handleGameHasStoppedMessage,
        handleGameHasResetMessage,
        handleGameStartedMessage,
    } = dependencies;

    setScreenSocket(socket);
    ScreenSocket.getInstance(socket);

    const connectedUsersSocket = new MessageSocket(connectedUsersTypeGuard, socket);
    const startPhaserGameSocket = new MessageSocket(startPhaserGameTypeGuard, socket);
    const startSheepGameSocket = new MessageSocket(startSheepGameTypeGuard, socket);
    const finishedSocket = new MessageSocket(finishedTypeGuard, socket);
    const resetSocket = new MessageSocket(resetTypeGuard, socket);
    const pausedSocket = new MessageSocket(pausedTypeGuard, socket);
    const resumedSocket = new MessageSocket(resumedTypeGuard, socket);
    const stoppedSocket = new MessageSocket(stoppedTypeGuard, socket);
    const errorSocket = new MessageSocket(errorTypeGuard, socket);
    const screenAdminSocket = new MessageSocket(screenAdminTypeGuard, socket);
    const screenStateSocket = new MessageSocket(screenStateTypeGuard, socket);
    const startedSocket = new MessageSocket(startedTypeGuard, socket);
    const gameSetSocket = new MessageSocket(gameSetTypeGuard, socket);

    connectedUsersSocket.listen((data: ConnectedUsersMessage) => handleConnectedUsersMessage(data));

    finishedSocket.listen((data: GameHasFinishedMessage) => handleGameHasFinishedMessage({ data, roomId }));

    startPhaserGameSocket.listen((data: StartPhaserGameMessage) => handleStartPhaserGameMessage(roomId));

    startSheepGameSocket.listen((data: StartSheepGameMessage) => handleStartSheepGameMessage(roomId));

    pausedSocket.listen(() => setHasPaused(true));

    resumedSocket.listen(() => setHasPaused(false));

    stoppedSocket.listen(() => handleGameHasStoppedMessage(roomId));

    resetSocket.listen(() => handleGameHasResetMessage(roomId));

    errorSocket.listen((data: ErrorMessage) => {
        // TODO handle errors
    });

    screenAdminSocket.listen((data: ScreenAdminMessage) => setScreenAdmin(data.isAdmin));

    screenStateSocket.listen((data: ScreenStateMessage) => {
        const screenState = data.game ? `${data.state}/${data.game}` : data.state;
        setScreenState(screenState);
    });

    startedSocket.listen((data: GameHasStartedMessage) => {
        handleGameStartedMessage({ roomId, game: data.game, countdownTime: data.countdownTime });
    });

    gameSetSocket.listen((data: GameSetMessage) => setChosenGame(data.game));

    handleSetCommonSocketsGame3(socket, {
        setTopicMessage,
        setVoteForPhotoMessage,
        setFinalRoundCountdownTime,
        setVotingResults,
    });

    handleSetScreenSocketGame3(socket, {
        setRoundIdx,
        setVoteForPhotoMessage,
        setVotingResults,
        setPresentFinalPhotos,
    });

    history.push(`${Routes.screen}/${roomId}/${route || Routes.lobby}`);
}
