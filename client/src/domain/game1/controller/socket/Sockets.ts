

import {
    HandlePlayerFinishedProps
} from "../../../commonGameState/controller/handlePlayerFinishedMessage";
import { MessageSocket } from "../../../socket/MessageSocket";
import { Socket } from "../../../socket/Socket";
import {
    ApproachingSolvableObstacleMessage, approachingSolvableObstacleTypeGuard
} from "../../../typeGuards/game1/approachingSolvableObstacleTypeGuard";
import {
    exceededMaxChaserPushesTypeGuard
} from "../../../typeGuards/game1/exceededMaxChaserPushes";
import { PlayerDiedMessage, playerDiedTypeGuard } from "../../../typeGuards/game1/playerDied";
import {
    PlayerFinishedMessage, playerFinishedTypeGuard
} from "../../../typeGuards/game1/playerFinished";
import {
    StunnablePlayersMessage, stunnablePlayersTypeGuard
} from "../../../typeGuards/game1/stunnablePlayers";
import { HandlePlayerDiedProps } from "../gameState/handlePlayerDied";

export interface HandleSetControllerSocketGame1Dependencies {
    setExceededChaserPushes: (val: boolean) => void;
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
        setExceededChaserPushes,
        handlePlayerFinishedMessage,
        handleStunnablePlayers,
        handlePlayerDied,
        handleApproachingObstacleMessage,
    } = dependencies;

    const playerFinishedSocket = new MessageSocket(playerFinishedTypeGuard, socket);
    const playerDiedSocket = new MessageSocket(playerDiedTypeGuard, socket);
    const approachingSolvableObstacleSocket = new MessageSocket(approachingSolvableObstacleTypeGuard, socket);
    const exceededMaxChaserPushesSocket = new MessageSocket(exceededMaxChaserPushesTypeGuard, socket);
    const stunnablePlayersSocket = new MessageSocket(stunnablePlayersTypeGuard, socket);

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

    approachingSolvableObstacleSocket.listen((data: ApproachingSolvableObstacleMessage) => {
        handleApproachingObstacleMessage(data);
    });

    exceededMaxChaserPushesSocket.listen(() => setExceededChaserPushes(true));

    stunnablePlayersSocket.listen((data: StunnablePlayersMessage) => handleStunnablePlayers(data));
}
