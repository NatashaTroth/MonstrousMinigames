import { History } from 'history';

import { HandlePlayerFinishedProps } from '../../../commonGameState/controller/handlePlayerFinishedMessage';
import { MessageSocket } from '../../../socket/MessageSocket';
import { Socket } from '../../../socket/Socket';
import {
    ApproachingSolvableObstacleMessage,
    approachingSolvableObstacleTypeGuard,
} from '../../../typeGuards/game1/approachingSolvableObstacleTypeGuard';
import { exceededMaxChaserPushesTypeGuard } from '../../../typeGuards/game1/exceededMaxChaserPushes';
import { ObstacleMessage, obstacleTypeGuard } from '../../../typeGuards/game1/obstacle';
import { PlayerDiedMessage, playerDiedTypeGuard } from '../../../typeGuards/game1/playerDied';
import { PlayerFinishedMessage, playerFinishedTypeGuard } from '../../../typeGuards/game1/playerFinished';
import { playerStunnedTypeGuard } from '../../../typeGuards/game1/playerStunned';
import { playerUnstunnedTypeGuard } from '../../../typeGuards/game1/playerUnstunned';
import { StunnablePlayersMessage, stunnablePlayersTypeGuard } from '../../../typeGuards/game1/stunnablePlayers';
import { HandleObstacleMessageProps } from '../gameState/handleObstacleMessage';
import { HandlePlayerDiedProps } from '../gameState/handlePlayerDied';
import { handlePlayerStunned } from '../gameState/handlePlayerStunned';
import { handlePlayerUnstunned } from '../gameState/handlePlayerUnstunned';

export interface HandleSetControllerSocketGame1Dependencies {
    history: History;
    setExceededChaserPushes: (val: boolean) => void;
    handleObstacleMessage: (data: HandleObstacleMessageProps) => void;
    handlePlayerFinishedMessage: (data: HandlePlayerFinishedProps) => void;
    handleStunnablePlayers: (data: StunnablePlayersMessage) => void;
    handlePlayerDied: (data: HandlePlayerDiedProps) => void;
    handleApproachingObstacleMessage: (data: ApproachingSolvableObstacleMessage) => void;
}

export function handleSetControllerSocketGame1(
    socket: Socket,
    roomId: string,
    playerFinished: boolean,
    dependencies: HandleSetControllerSocketGame1Dependencies
) {
    const {
        history,
        setExceededChaserPushes,
        handleObstacleMessage,
        handlePlayerFinishedMessage,
        handleStunnablePlayers,
        handlePlayerDied,
        handleApproachingObstacleMessage,
    } = dependencies;

    const obstacleSocket = new MessageSocket(obstacleTypeGuard, socket);
    const playerFinishedSocket = new MessageSocket(playerFinishedTypeGuard, socket);
    const playerDiedSocket = new MessageSocket(playerDiedTypeGuard, socket);
    const playerStunnedSocket = new MessageSocket(playerStunnedTypeGuard, socket);
    const playerUnstunnedSocket = new MessageSocket(playerUnstunnedTypeGuard, socket);
    const approachingSolvableObstacleSocket = new MessageSocket(approachingSolvableObstacleTypeGuard, socket);
    const exceededMaxChaserPushesSocket = new MessageSocket(exceededMaxChaserPushesTypeGuard, socket);
    const stunnablePlayersSocket = new MessageSocket(stunnablePlayersTypeGuard, socket);

    obstacleSocket.listen((data: ObstacleMessage) => {
        handleObstacleMessage({
            data,
            roomId,
        });
    });

    playerFinishedSocket.listen((data: PlayerFinishedMessage) => {
        handlePlayerFinishedMessage({
            data,
            roomId,
            playerFinished,
        });
    });

    playerDiedSocket.listen((data: PlayerDiedMessage) => {
        handlePlayerDied({
            data,
            roomId,
        });
    });

    playerStunnedSocket.listen(() => {
        handlePlayerStunned(history, roomId);
    });

    playerUnstunnedSocket.listen(() => {
        handlePlayerUnstunned(history, roomId);
    });

    approachingSolvableObstacleSocket.listen((data: ApproachingSolvableObstacleMessage) => {
        handleApproachingObstacleMessage(data);
    });

    exceededMaxChaserPushesSocket.listen(() => setExceededChaserPushes(true));

    stunnablePlayersSocket.listen((data: StunnablePlayersMessage) => handleStunnablePlayers(data));
}
