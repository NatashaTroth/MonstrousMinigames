import { createMemoryHistory } from "history";

import { handleSetControllerSocketGame1 } from "../../domain/game1/controller/socket/Sockets";
import { InMemorySocketFake } from "../../domain/socket/InMemorySocketFake";
import {
    ApproachingSolvableObstacleMessage
} from "../../domain/typeGuards/game1/approachingSolvableObstacleTypeGuard";
import {
    ExceededMaxChaserPushesMessage
} from "../../domain/typeGuards/game1/exceededMaxChaserPushes";
import { ObstacleMessage } from "../../domain/typeGuards/game1/obstacle";
import { PlayerDiedMessage } from "../../domain/typeGuards/game1/playerDied";
import { PlayerFinishedMessage } from "../../domain/typeGuards/game1/playerFinished";
import { PlayerStunnedMessage } from "../../domain/typeGuards/game1/playerStunned";
import { PlayerUnstunnedMessage } from "../../domain/typeGuards/game1/playerUnstunned";
import { StunnablePlayersMessage } from "../../domain/typeGuards/game1/stunnablePlayers";
import { MessageTypesGame1, ObstacleTypes } from "../../utils/constants";
import { controllerGame1Route, controllerPlayerStunnedRoute } from "../../utils/routes";

describe('handleSetSocket', () => {
    const history = createMemoryHistory();
    const roomId = 'ABCD';

    const dependencies = {
        setPlayerFinished: jest.fn(),
        setObstacle: jest.fn(),
        setPlayerRank: jest.fn(),
        setPlayerDead: jest.fn(),
        history,
        setEarlySolvableObstacle: jest.fn(),
        setExceededChaserPushes: jest.fn(),
        setStunnablePlayers: jest.fn(),
    };

    it('when PlayerFinishedMessage was written, handed setPlayerFinished is executed', async () => {
        const message: PlayerFinishedMessage = {
            type: MessageTypesGame1.playerFinished,
            userId: '1',
            rank: 1,
        };

        const socket = new InMemorySocketFake();
        const setPlayerFinished = jest.fn();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, setPlayerFinished });

        await socket.emit(message);

        expect(setPlayerFinished).toHaveBeenCalledTimes(1);
    });

    it('when ObstacleMessage was written, handed setObstacle is executed', async () => {
        const message: ObstacleMessage = {
            type: MessageTypesGame1.obstacle,
            obstacleType: ObstacleTypes.spider,
            obstacleId: 1,
        };

        const socket = new InMemorySocketFake();
        const setObstacle = jest.fn();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, setObstacle });

        await socket.emit(message);

        expect(setObstacle).toHaveBeenCalledTimes(1);
    });

    it('when PlayerDiedMessage was written, handed setPlayerDead is executed', async () => {
        const message: PlayerDiedMessage = {
            type: MessageTypesGame1.playerDied,
            rank: 0,
        };

        const socket = new InMemorySocketFake();
        const setPlayerDead = jest.fn();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, setPlayerDead });

        await socket.emit(message);

        expect(setPlayerDead).toHaveBeenCalledTimes(1);
    });

    it('when PlayerStunnedMessage was written, history should be reroute to stunned screen', async () => {
        const message: PlayerStunnedMessage = {
            type: MessageTypesGame1.playerStunned,
        };

        const socket = new InMemorySocketFake();
        const history = createMemoryHistory();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, history });

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', controllerPlayerStunnedRoute(roomId));
    });

    it('when PlayerUnstunnedMessage was written, history should be reroute to game1 screen', async () => {
        const message: PlayerUnstunnedMessage = {
            type: MessageTypesGame1.playerUnstunned,
        };

        const socket = new InMemorySocketFake();
        const history = createMemoryHistory();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, history });

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', controllerGame1Route(roomId));
    });

    it('when ApproachingSolvableObstacleMessage was written, handed setEarlySolvableObstacle is executed', async () => {
        const message: ApproachingSolvableObstacleMessage = {
            type: MessageTypesGame1.approachingSolvableObstacle,
            obstacleId: 1,
            obstacleType: ObstacleTypes.stone,
            distance: 200,
        };

        const socket = new InMemorySocketFake();
        const setEarlySolvableObstacle = jest.fn();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, setEarlySolvableObstacle });

        await socket.emit(message);

        expect(setEarlySolvableObstacle).toHaveBeenCalledTimes(1);
    });

    it('when ExceededMaxChaserPushesMessage was written, handed setExceededChaserPushes is executed', async () => {
        const message: ExceededMaxChaserPushesMessage = {
            type: MessageTypesGame1.exceededNumberOfChaserPushes,
        };

        const socket = new InMemorySocketFake();
        const setExceededChaserPushes = jest.fn();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, setExceededChaserPushes });

        await socket.emit(message);

        expect(setExceededChaserPushes).toHaveBeenCalledTimes(1);
    });

    it('when ExceededMaxChaserPushesMessage was written, handed setStunnablePlayers is executed', async () => {
        const message: StunnablePlayersMessage = {
            type: MessageTypesGame1.stunnablePlayers,
            roomId: 'ABCD',
            stunnablePlayers: ['1'],
        };

        const socket = new InMemorySocketFake();
        const setStunnablePlayers = jest.fn();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, setStunnablePlayers });

        await socket.emit(message);

        expect(setStunnablePlayers).toHaveBeenCalledTimes(1);
    });
});
