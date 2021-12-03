

import {
    handleSetControllerSocketGame1, HandleSetControllerSocketGame1Dependencies
} from "../../domain/game1/controller/socket/Sockets";
import { InMemorySocketFake } from "../../domain/socket/InMemorySocketFake";
import {
    ApproachingSolvableObstacleMessage
} from "../../domain/typeGuards/game1/approachingSolvableObstacleTypeGuard";
import {
    ExceededMaxChaserPushesMessage
} from "../../domain/typeGuards/game1/exceededMaxChaserPushes";
import { PlayerDiedMessage } from "../../domain/typeGuards/game1/playerDied";
import { PlayerFinishedMessage } from "../../domain/typeGuards/game1/playerFinished";
import { StunnablePlayersMessage } from "../../domain/typeGuards/game1/stunnablePlayers";
import { MessageTypesGame1, ObstacleTypes } from "../../utils/constants";

describe('handleSetSocket', () => {
    const roomId = 'ABCD';

    const dependencies: HandleSetControllerSocketGame1Dependencies = {
        setExceededChaserPushes: jest.fn(),
        handlePlayerFinishedMessage: jest.fn(),
        handleStunnablePlayers: jest.fn(),
        handlePlayerDied: jest.fn(),
        handleApproachingObstacleMessage: jest.fn(),
    };

    it('when PlayerFinishedMessage was written, handed handlePlayerFinishedMessage is executed', async () => {
        const message: PlayerFinishedMessage = {
            type: MessageTypesGame1.playerFinished,
            userId: '1',
            rank: 1,
        };

        const socket = new InMemorySocketFake();
        const handlePlayerFinishedMessage = jest.fn();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, handlePlayerFinishedMessage });

        await socket.emit(message);

        expect(handlePlayerFinishedMessage).toHaveBeenCalledTimes(1);
    });

    it('when PlayerDiedMessage was written, handed handlePlayerDied is executed', async () => {
        const message: PlayerDiedMessage = {
            type: MessageTypesGame1.playerDied,
            rank: 0,
        };

        const socket = new InMemorySocketFake();
        const handlePlayerDied = jest.fn();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, handlePlayerDied });

        await socket.emit(message);

        expect(handlePlayerDied).toHaveBeenCalledTimes(1);
    });

    it('when ApproachingSolvableObstacleMessage was written, handed handleApproachingObstacleMessage is executed', async () => {
        const message: ApproachingSolvableObstacleMessage = {
            type: MessageTypesGame1.approachingSolvableObstacle,
            obstacleId: 1,
            obstacleType: ObstacleTypes.stone,
            distance: 200,
        };

        const socket = new InMemorySocketFake();
        const handleApproachingObstacleMessage = jest.fn();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, handleApproachingObstacleMessage });

        await socket.emit(message);

        expect(handleApproachingObstacleMessage).toHaveBeenCalledTimes(1);
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

    it('when ExceededMaxChaserPushesMessage was written, handed handleStunnablePlayers is executed', async () => {
        const message: StunnablePlayersMessage = {
            type: MessageTypesGame1.stunnablePlayers,
            roomId: 'ABCD',
            stunnablePlayers: ['1'],
        };

        const socket = new InMemorySocketFake();
        const handleStunnablePlayers = jest.fn();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, handleStunnablePlayers });

        await socket.emit(message);

        expect(handleStunnablePlayers).toHaveBeenCalledTimes(1);
    });
});
