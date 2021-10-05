import { History } from "history";

import { Obstacle } from "../../../../contexts/PlayerContextProvider";
import {
    handleGameHasFinishedMessage
} from "../../../commonGameState/controller/handleGameHasFinishedMessage";
import {
    handlePlayerFinishedMessage
} from "../../../commonGameState/controller/handlePlayerFinishedMessage";
import { MessageSocket } from "../../../socket/MessageSocket";
import { Socket } from "../../../socket/Socket";
import { finishedTypeGuard, GameHasFinishedMessage } from "../../../typeGuards/finished";
import {
    ApproachingSolvableObstacleMessage, approachingSolvableObstacleTypeGuard
} from "../../../typeGuards/game1/approachingSolvableObstacleTypeGuard";
import {
    exceededMaxChaserPushesTypeGuard
} from "../../../typeGuards/game1/exceededMaxChaserPushes";
import { ObstacleMessage, obstacleTypeGuard } from "../../../typeGuards/game1/obstacle";
import { PlayerDiedMessage, playerDiedTypeGuard } from "../../../typeGuards/game1/playerDied";
import {
    PlayerFinishedMessage, playerFinishedTypeGuard
} from "../../../typeGuards/game1/playerFinished";
import { playerStunnedTypeGuard } from "../../../typeGuards/game1/playerStunned";
import { playerUnstunnedTypeGuard } from "../../../typeGuards/game1/playerUnstunned";
import {
    StunnablePlayersMessage, stunnablePlayersTypeGuard
} from "../../../typeGuards/game1/stunnablePlayers";
import {
    handleApproachingObstacleMessage
} from "../gameState/handleApproachingSolvableObstacleMessage";
import { handleObstacleMessage } from "../gameState/handleObstacleMessage";
import { handlePlayerDied } from "../gameState/handlePlayerDied";
import { handlePlayerStunned } from "../gameState/handlePlayerStunned";
import { handlePlayerUnstunned } from "../gameState/handlePlayerUnstunned";
import { handleStunnablePlayers } from "../gameState/handleStunnablePlayers";

export interface HandleSetControllerSocketGame1Dependencies {
    setPlayerFinished: (val: boolean) => void;
    setObstacle: (roomId: string | undefined, obstacle: undefined | Obstacle) => void;
    setPlayerRank: (val: number) => void;
    setPlayerDead: (val: boolean) => void;
    history: History;
    playerRank: undefined | number;
    setEarlySolvableObstacle: (val: Obstacle | undefined) => void;
    setExceededChaserPushes: (val: boolean) => void;
    setStunnablePlayers: (val: string[]) => void;
}

export function handleSetControllerSocketGame1(
    socket: Socket,
    roomId: string,
    playerFinished: boolean,
    dependencies: HandleSetControllerSocketGame1Dependencies
) {
    const {
        setPlayerFinished,
        setObstacle,
        setPlayerRank,
        setPlayerDead,
        history,
        playerRank,
        setEarlySolvableObstacle,
        setExceededChaserPushes,
        setStunnablePlayers,
    } = dependencies;

    const obstacleSocket = new MessageSocket(obstacleTypeGuard, socket);
    const playerFinishedSocket = new MessageSocket(playerFinishedTypeGuard, socket);
    const playerDiedSocket = new MessageSocket(playerDiedTypeGuard, socket);
    const playerStunnedSocket = new MessageSocket(playerStunnedTypeGuard, socket);
    const gameFinishedSocket = new MessageSocket(finishedTypeGuard, socket);
    const playerUnstunnedSocket = new MessageSocket(playerUnstunnedTypeGuard, socket);
    const approachingSolvableObstacleSocket = new MessageSocket(approachingSolvableObstacleTypeGuard, socket);
    const exceededMaxChaserPushesSocket = new MessageSocket(exceededMaxChaserPushesTypeGuard, socket);
    const stunnablePlayersSocket = new MessageSocket(stunnablePlayersTypeGuard, socket);

    obstacleSocket.listen((data: ObstacleMessage) => {
        handleObstacleMessage({
            data,
            roomId,
            setObstacle,
        });
    });

    playerFinishedSocket.listen((data: PlayerFinishedMessage) => {
        handlePlayerFinishedMessage({
            data,
            roomId,
            playerFinished,
            dependencies: {
                setPlayerFinished,
                setPlayerRank,
            },
        });
    });

    playerDiedSocket.listen((data: PlayerDiedMessage) => {
        handlePlayerDied({
            data,
            roomId,
            dependencies: {
                setPlayerDead,
                setPlayerRank,
            },
        });
    });

    playerStunnedSocket.listen(() => {
        handlePlayerStunned(history, roomId);
    });

    playerUnstunnedSocket.listen(() => {
        handlePlayerUnstunned(history, roomId);
    });

    gameFinishedSocket.listen((data: GameHasFinishedMessage) => {
        handleGameHasFinishedMessage({
            roomId,
            playerRank,
            playerRanks: data.data.playerRanks,
            dependencies: {
                setPlayerRank,
            },
            history,
        });
    });

    approachingSolvableObstacleSocket.listen((data: ApproachingSolvableObstacleMessage) => {
        handleApproachingObstacleMessage({ data, setEarlySolvableObstacle });
    });

    exceededMaxChaserPushesSocket.listen(() => setExceededChaserPushes(true));

    stunnablePlayersSocket.listen((data: StunnablePlayersMessage) =>
        handleStunnablePlayers({
            data,
            dependencies: {
                setStunnablePlayers,
            },
        })
    );
}
