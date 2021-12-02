import { createMemoryHistory } from 'history';

import { GameNames } from '../../config/games';
import { handleSetSocket, HandleSetSocketDependencies } from '../../domain/socket/controller/handleSetSocket';
import { InMemorySocketFake } from '../../domain/socket/InMemorySocketFake';
import { ConnectedUsersMessage } from '../../domain/typeGuards/connectedUsers';
import { GameHasFinishedMessage } from '../../domain/typeGuards/finished';
import { GameHasStartedMessage } from '../../domain/typeGuards/game1/started';
import { GameHasPausedMessage } from '../../domain/typeGuards/paused';
import { GameHasResetMessage } from '../../domain/typeGuards/reset';
import { GameHasResumedMessage } from '../../domain/typeGuards/resumed';
import { GameHasStoppedMessage } from '../../domain/typeGuards/stopped';
import { UserInitMessage } from '../../domain/typeGuards/userInit';
import { GameState, MessageTypes } from '../../utils/constants';
import { controllerChooseCharacterRoute } from '../../utils/routes';

describe('handleSetSocket', () => {
    const history = createMemoryHistory();
    const roomId = 'ABCD';

    const dependencies: HandleSetSocketDependencies = {
        history,
        setChosenGame: jest.fn(),
        setControllerSocket: jest.fn(),
        setExceededChaserPushes: jest.fn(),
        setFinalRoundCountdownTime: jest.fn(),
        setHasPaused: jest.fn(),
        setPresentFinalPhotos: jest.fn(),
        setRoundIdx: jest.fn(),
        setTopicMessage: jest.fn(),
        setVoteForPhotoMessage: jest.fn(),
        setVotingResults: jest.fn(),
        handleConnectedUsersMessage: jest.fn(),
        handleGameHasFinishedMessage: jest.fn(),
        handleGameHasStoppedMessage: jest.fn(),
        handleGameStartedMessage: jest.fn(),
        handleUserInitMessage: jest.fn(),
        handleGameHasResetMessage: jest.fn(),
        handleObstacleMessage: jest.fn(),
        handlePlayerDied: jest.fn(),
        handlePlayerFinishedMessage: jest.fn(),
        handleStunnablePlayers: jest.fn(),
        handleApproachingObstacleMessage: jest.fn(),
    };

    it('when UserInitMessage was written, handed handleUserInitMessage is executed', async () => {
        const message: UserInitMessage = {
            name: 'Mock',
            type: MessageTypes.userInit,
            userId: '1',
            roomId,
            isAdmin: true,
            number: 1,
            ready: true,
        };

        const socket = new InMemorySocketFake();
        const handleUserInitMessage = jest.fn();

        handleSetSocket(socket, roomId, false, { ...dependencies, handleUserInitMessage });

        await socket.emit(message);

        expect(handleUserInitMessage).toHaveBeenCalledTimes(1);
    });

    it('when GameHasStartedMessage was written, handed handleGameStartedMessage is executed', async () => {
        const message: GameHasStartedMessage = {
            type: MessageTypes.gameHasStarted,
            countdownTime: 3000,
            game: GameNames.game1,
        };

        const socket = new InMemorySocketFake();
        const handleGameStartedMessage = jest.fn();

        handleSetSocket(socket, roomId, false, { ...dependencies, handleGameStartedMessage });

        await socket.emit(message);

        expect(handleGameStartedMessage).toHaveBeenCalledTimes(1);
    });

    it('when GameHasPausedMessage was written, handed setHasPaused is executed', async () => {
        const message: GameHasPausedMessage = {
            type: MessageTypes.gameHasPaused,
        };

        const socket = new InMemorySocketFake();
        const setHasPaused = jest.fn();

        handleSetSocket(socket, roomId, false, { ...dependencies, setHasPaused });

        await socket.emit(message);

        expect(setHasPaused).toHaveBeenCalledWith(true);
    });

    it('when GameHasResumedMessage was written, handed setHasPaused is executed', async () => {
        const message: GameHasResumedMessage = {
            type: MessageTypes.gameHasResumed,
        };

        const socket = new InMemorySocketFake();
        const setHasPaused = jest.fn();

        handleSetSocket(socket, roomId, false, { ...dependencies, setHasPaused });

        await socket.emit(message);

        expect(setHasPaused).toHaveBeenCalledWith(false);
    });

    it('when GameHasStoppedMessage was written, handed handleGameHasStoppedMessage should be called', async () => {
        const message: GameHasStoppedMessage = {
            type: MessageTypes.gameHasStopped,
        };

        const socket = new InMemorySocketFake();
        const handleGameHasStoppedMessage = jest.fn();

        handleSetSocket(socket, roomId, false, { ...dependencies, handleGameHasStoppedMessage });

        await socket.emit(message);

        expect(handleGameHasStoppedMessage).toHaveBeenCalledTimes(1);
    });

    it('when GameHasResetMessage was written, handleGameHasResetMessage should be executed', async () => {
        const message: GameHasResetMessage = {
            type: MessageTypes.gameHasReset,
        };

        const socket = new InMemorySocketFake();
        const handleGameHasResetMessage = jest.fn();

        handleSetSocket(socket, roomId, false, { ...dependencies, handleGameHasResetMessage });

        await socket.emit(message);

        expect(handleGameHasResetMessage).toHaveBeenCalledTimes(1);
    });

    it('when ConnectedUsersMessage was written, handed handleConnectedUsersMessage is executed', async () => {
        const users = [
            {
                id: '1',
                name: 'Mock',
                roomId,
                number: 1,
                characterNumber: 0,
                active: true,
                ready: true,
            },
        ];

        const message: ConnectedUsersMessage = {
            type: MessageTypes.connectedUsers,
            users,
        };

        const socket = new InMemorySocketFake();
        const handleConnectedUsersMessage = jest.fn();

        handleSetSocket(socket, roomId, false, { ...dependencies, handleConnectedUsersMessage });

        await socket.emit(message);

        expect(handleConnectedUsersMessage).toHaveBeenCalledWith(message);
    });

    it('when GameHasFinishedMessage was written, handed handleGameHasFinishedMessage is executed', async () => {
        const message: GameHasFinishedMessage = {
            type: MessageTypes.gameHasFinished,
            data: {
                gameState: GameState.finished,
                numberOfObstacles: 4,
                roomId,
                trackLength: 5000,
                playersState: [],
                playerRanks: [
                    {
                        id: '1',
                        rank: 1,
                        isActive: true,
                        name: 'Mock',
                        finished: true,
                        positionX: 5000,
                        dead: false,
                    },
                ],
            },
        };

        global.sessionStorage.clear();
        global.sessionStorage.setItem('userId', '1');

        const socket = new InMemorySocketFake();
        const handleGameHasFinishedMessage = jest.fn();

        handleSetSocket(socket, roomId, false, { ...dependencies, handleGameHasFinishedMessage });

        await socket.emit(message);

        expect(handleGameHasFinishedMessage).toHaveBeenCalledTimes(1);
    });

    it('when a socket gets passed, history should be reroute to choose character route', async () => {
        const socket = new InMemorySocketFake();
        const history = createMemoryHistory();

        handleSetSocket(socket, roomId, false, { ...dependencies, history });

        expect(history.location).toHaveProperty('pathname', controllerChooseCharacterRoute(roomId));
    });
});
