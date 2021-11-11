import { createMemoryHistory } from 'history';

import { GameNames } from '../../config/games';
import { InMemorySocketFake } from '../../domain/socket/InMemorySocketFake';
import { handleSetSocket } from '../../domain/socket/screen/handleSetSocket';
import { ConnectedUsersMessage } from '../../domain/typeGuards/connectedUsers';
import { GameHasFinishedMessage } from '../../domain/typeGuards/finished';
import { GameHasStartedMessage } from '../../domain/typeGuards/game1/started';
import { NewPhotoTopicMessage } from '../../domain/typeGuards/game3/newPhotoTopic';
import { GameHasPausedMessage } from '../../domain/typeGuards/paused';
import { GameHasResetMessage } from '../../domain/typeGuards/reset';
import { GameHasResumedMessage } from '../../domain/typeGuards/resumed';
import { StartPhaserGameMessage } from '../../domain/typeGuards/startPhaserGame';
import { GameHasStoppedMessage } from '../../domain/typeGuards/stopped';
import { GameState, MessageTypes, MessageTypesGame1, MessageTypesGame3 } from '../../utils/constants';
import { screenLobbyRoute } from '../../utils/routes';

describe('handleSetSocket', () => {
    const history = createMemoryHistory();
    const roomId = 'ABCD';

    const dependencies = {
        setScreenSocket: jest.fn(),
        setConnectedUsers: jest.fn(),
        setHasPaused: jest.fn(),
        setGameStarted: jest.fn(),
        setCountdownTime: jest.fn(),
        setFinished: jest.fn(),
        setPlayerRanks: jest.fn(),
        setScreenAdmin: jest.fn(),
        setScreenState: jest.fn(),
        setChosenGame: jest.fn(),
        setTopicMessage: jest.fn(),
        setRoundIdx: jest.fn(),
        setSheepGameStarted: jest.fn(),
        setVoteForPhotoMessage: jest.fn(),
        setVotingResults: jest.fn(),
        setFinalRoundCountdownTime: jest.fn(),
        history,
    };

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

        handleSetSocket(socket, roomId, { ...dependencies, setConnectedUsers });

        await socket.emit(message);

        expect(setConnectedUsers).toHaveBeenCalledWith(users);
    });

    it('when GameHasFinishedMessage was written, handed setFinished is executed', async () => {
        const message: GameHasFinishedMessage = {
            type: MessageTypes.gameHasFinished,
            data: {
                gameState: GameState.finished,
                numberOfObstacles: 4,
                roomId,
                trackLength: 5000,
                playerRanks: [],
                playersState: [],
            },
        };

        const socket = new InMemorySocketFake();
        const setFinished = jest.fn();

        handleSetSocket(socket, roomId, { ...dependencies, setFinished });

        await socket.emit(message);

        expect(setFinished).toHaveBeenCalledWith(true);
    });

    it('when StartPhaserGameMessage was written, handed setGameStarted is executed', async () => {
        const message: StartPhaserGameMessage = {
            type: MessageTypesGame1.startPhaserGame,
        };

        const socket = new InMemorySocketFake();
        const setGameStarted = jest.fn();

        handleSetSocket(socket, roomId, { ...dependencies, setGameStarted });

        await socket.emit(message);

        expect(setGameStarted).toHaveBeenCalledWith(true);
    });

    it('when GameHasPausedMessage was written, handed setHasPaused is executed', async () => {
        const message: GameHasPausedMessage = {
            type: MessageTypes.gameHasPaused,
        };

        const socket = new InMemorySocketFake();
        const setHasPaused = jest.fn();

        handleSetSocket(socket, roomId, { ...dependencies, setHasPaused });

        await socket.emit(message);

        expect(setHasPaused).toHaveBeenCalledWith(true);
    });

    it('when GameHasResumedMessage was written, handed setHasPaused is executed', async () => {
        const message: GameHasResumedMessage = {
            type: MessageTypes.gameHasResumed,
        };

        const socket = new InMemorySocketFake();
        const setHasPaused = jest.fn();

        handleSetSocket(socket, roomId, { ...dependencies, setHasPaused });

        await socket.emit(message);

        expect(setHasPaused).toHaveBeenCalledWith(false);
    });

    it('when GameHasStoppedMessage was written, history should be reroute to screen lobby', async () => {
        const message: GameHasStoppedMessage = {
            type: MessageTypes.gameHasStopped,
        };

        const socket = new InMemorySocketFake();
        const history = createMemoryHistory();

        handleSetSocket(socket, roomId, { ...dependencies, history });

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', screenLobbyRoute(roomId));
    });

    it('when GameHasResetMessage was written, history should be reroute to controller lobby', async () => {
        const message: GameHasResetMessage = {
            type: MessageTypes.gameHasReset,
        };

        const socket = new InMemorySocketFake();
        const history = createMemoryHistory();

        handleSetSocket(socket, roomId, { ...dependencies, history });

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', screenLobbyRoute(roomId));
    });

    it('when GameHasStartedMessage was written and game is game3, handed setGameStarted should be executed', async () => {
        const message: GameHasStartedMessage = {
            type: MessageTypes.gameHasStarted,
            countdownTime: 3000,
            game: GameNames.game3,
        };

        const socket = new InMemorySocketFake();
        const setGameStarted = jest.fn();

        handleSetSocket(socket, roomId, { ...dependencies, setGameStarted });

        await socket.emit(message);

        expect(setGameStarted).toHaveBeenCalledWith(true);
    });
    it('when NewPhotoTopicMessage was written and game is game3, handed setTopicMessage should be executed', async () => {
        const message: NewPhotoTopicMessage = {
            type: MessageTypesGame3.newPhotoTopic,
            roomId: '123123asd',
            countdownTime: 10000,
            topic: 'Test-topic',
        };

        const socket = new InMemorySocketFake();
        const setTopicMessage = jest.fn();

        handleSetSocket(socket, roomId, { ...dependencies, setTopicMessage });

        await socket.emit(message);

        expect(setTopicMessage).toHaveBeenCalledWith({ countdownTime: 10000, topic: 'Test-topic' });
    });
});
