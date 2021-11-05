import { createMemoryHistory } from "history";

import { GameNames } from "../../../config/games";
import { GameState, MessageTypes } from "../../../utils/constants";
import { controllerChooseCharacterRoute, controllerLobbyRoute } from "../../../utils/routes";
import { ConnectedUsersMessage } from "../../typeGuards/connectedUsers";
import { GameHasFinishedMessage } from "../../typeGuards/finished";
import { GameHasStartedMessage } from "../../typeGuards/game1/started";
import { GameHasPausedMessage } from "../../typeGuards/paused";
import { GameHasResetMessage } from "../../typeGuards/reset";
import { GameHasResumedMessage } from "../../typeGuards/resumed";
import { GameHasStoppedMessage } from "../../typeGuards/stopped";
import { UserInitMessage } from "../../typeGuards/userInit";
import { InMemorySocketFake } from "../InMemorySocketFake";
import { handleSetSocket } from "./handleSetSocket";

describe('handleSetSocket', () => {
    const history = createMemoryHistory();
    const roomId = 'ABCD';

    const dependencies = {
        setRoomId: jest.fn(),
        setControllerSocket: jest.fn(),
        setPlayerNumber: jest.fn(),
        setPlayerFinished: jest.fn(),
        setObstacle: jest.fn(),
        setPlayerRank: jest.fn(),
        setHasPaused: jest.fn(),
        setGameStarted: jest.fn(),
        setName: jest.fn(),
        setAvailableCharacters: jest.fn(),
        setUserId: jest.fn(),
        setReady: jest.fn(),
        setPlayerDead: jest.fn(),
        history,
        setConnectedUsers: jest.fn(),
        playerRank: undefined,
        setEarlySolvableObstacle: jest.fn(),
        setExceededChaserPushes: jest.fn(),
        setStunnablePlayers: jest.fn(),
        setChosenGame: jest.fn(),
    };

    it('when UserInitMessage was written, handed setPlayerNumber is executed', async () => {
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
        const setPlayerNumber = jest.fn();

        handleSetSocket(socket, roomId, false, { ...dependencies, setPlayerNumber });

        await socket.emit(message);

        expect(setPlayerNumber).toHaveBeenCalledTimes(1);
    });

    it('when GameHasStartedMessage was written, handed setGameStarted is executed', async () => {
        const message: GameHasStartedMessage = {
            type: MessageTypes.gameHasStarted,
            countdownTime: 3000,
            game: GameNames.game1,
        };

        const socket = new InMemorySocketFake();
        const setGameStarted = jest.fn();

        handleSetSocket(socket, roomId, false, { ...dependencies, setGameStarted });

        await socket.emit(message);

        expect(setGameStarted).toHaveBeenCalledWith(true);
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

    it('when GameHasStoppedMessage was written, history should be reroute to controller lobby', async () => {
        const message: GameHasStoppedMessage = {
            type: MessageTypes.gameHasStopped,
        };

        const socket = new InMemorySocketFake();
        const history = createMemoryHistory();

        handleSetSocket(socket, roomId, false, { ...dependencies, history });

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', controllerLobbyRoute(roomId));
    });

    it('when GameHasResetMessage was written, history should be reroute to controller lobby', async () => {
        const message: GameHasResetMessage = {
            type: MessageTypes.gameHasReset,
        };

        const socket = new InMemorySocketFake();
        const history = createMemoryHistory();

        handleSetSocket(socket, roomId, false, { ...dependencies, history });

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', controllerLobbyRoute(roomId));
    });

    it('when ConnectedUsersMessage was written, handed setConnectedUsers is executed', async () => {
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
        const setConnectedUsers = jest.fn();

        handleSetSocket(socket, roomId, false, { ...dependencies, setConnectedUsers });

        await socket.emit(message);

        expect(setConnectedUsers).toHaveBeenCalledWith(users);
    });

    it('when GameHasFinishedMessage was written, handed setPlayerRank is executed and should be called with right rank', async () => {
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
        const setPlayerRank = jest.fn();

        handleSetSocket(socket, roomId, false, { ...dependencies, setPlayerRank });

        await socket.emit(message);

        expect(setPlayerRank).toHaveBeenCalledTimes(1);
    });

    it('when a socket gets passed, history should be reroute to choose character route', async () => {
        const socket = new InMemorySocketFake();
        const history = createMemoryHistory();

        handleSetSocket(socket, roomId, false, { ...dependencies, history });

        expect(history.location).toHaveProperty('pathname', controllerChooseCharacterRoute(roomId));
    });
});
