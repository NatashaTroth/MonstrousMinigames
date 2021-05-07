import { createMemoryHistory } from 'history';

import { MessageData } from '../../../contexts/ControllerSocketContextProvider';
import { MessageTypes, Obstacles } from '../../../utils/constants';
import { InMemorySocketFake } from '../../socket/InMemorySocketFake';
import { handleMessageData } from './handleMessageData';

describe('handleMessageData function', () => {
    let setPlayerRank: jest.Mock<any, any>;
    let setPlayerAdmin: jest.Mock<any, any>;
    let setPlayerNumber: jest.Mock<any, any>;
    let setObstacle: jest.Mock<any, any>;
    let setGameStarted: jest.Mock<any, any>;
    let setPlayerFinished: jest.Mock<any, any>;
    let setHasPaused: jest.Mock<any, any>;
    let resetGame: jest.Mock<any, any>;
    let resetPlayer: jest.Mock<any, any>;
    let defaultData: { roomId: string; playerFinished: boolean };
    const fakeSocket = new InMemorySocketFake();
    const history = createMemoryHistory();

    beforeEach(() => {
        setPlayerRank = jest.fn();
        setPlayerAdmin = jest.fn();
        setPlayerNumber = jest.fn();
        setObstacle = jest.fn();
        setGameStarted = jest.fn();
        setPlayerFinished = jest.fn();
        resetGame = jest.fn();
        resetPlayer = jest.fn();
        setHasPaused = jest.fn();

        defaultData = {
            roomId: '1234',
            playerFinished: false,
        };
    });

    it('when message type is user init, handed setPlayerAdmin should be called', () => {
        const mockData = {
            type: MessageTypes.userInit,
            isAdmin: true,
            number: 1,
        };

        handleMessageData({
            ...defaultData,
            socket: fakeSocket,
            data: mockData,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(setPlayerAdmin).toHaveBeenCalledTimes(1);
    });

    it('when message type is user init, handed setPlayerNumber should be called', () => {
        const mockData = {
            type: MessageTypes.userInit,
            isAdmin: true,
            number: 1,
        };

        handleMessageData({
            ...defaultData,
            socket: fakeSocket,
            data: mockData,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(setPlayerNumber).toHaveBeenCalledTimes(1);
    });

    it('when message type is obstacle, handed setObstacle should be called', () => {
        const mockData = {
            type: MessageTypes.obstacle,
            obstacleType: Obstacles.spider,
            obstacleId: 1,
        };

        handleMessageData({
            ...defaultData,
            data: mockData,
            socket: fakeSocket,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(setObstacle).toHaveBeenCalledTimes(1);
    });

    it('when message type is playerFinished, handed setPlayerFinished should be called', () => {
        const mockData = {
            type: MessageTypes.playerFinished,
            rank: 1,
        };

        handleMessageData({
            ...defaultData,
            data: mockData,
            socket: fakeSocket,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(setPlayerFinished).toHaveBeenCalledTimes(1);
    });

    it('when message type is playerFinished, handed setPlayerRank should be called', () => {
        const mockData = {
            type: MessageTypes.playerFinished,
            rank: 1,
        };

        handleMessageData({
            ...defaultData,
            data: mockData,
            socket: fakeSocket,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(setPlayerRank).toHaveBeenLastCalledWith(mockData.rank);
    });

    it('when message type is started, handed setGameStarted should be called with true', () => {
        const mockData = {
            type: MessageTypes.started,
        };

        handleMessageData({
            ...defaultData,
            data: mockData as MessageData,
            socket: fakeSocket,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });

    it('when message type is gameHasReset, history push should be called', () => {
        const mockData = {
            type: MessageTypes.gameHasReset,
        };

        const history = createMemoryHistory();

        handleMessageData({
            ...defaultData,
            data: mockData as MessageData,
            socket: fakeSocket,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(history.location).toHaveProperty('pathname', `/controller/${defaultData.roomId}/lobby`);
    });

    it('when message type is gameHasTimedOut, handed setPlayerFinished should be called with true', () => {
        const mockData = {
            type: MessageTypes.gameHasTimedOut,
            rank: 1,
        };

        handleMessageData({
            ...defaultData,
            data: mockData,
            socket: fakeSocket,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(setPlayerFinished).toHaveBeenLastCalledWith(true);
    });

    it('when message type is gameHasTimedOut, handed setPlayerRank should be called with rank', () => {
        const mockData = {
            type: MessageTypes.gameHasTimedOut,
            rank: 1,
        };

        handleMessageData({
            ...defaultData,
            data: mockData,
            socket: fakeSocket,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(setPlayerRank).toHaveBeenLastCalledWith(mockData.rank);
    });

    it('when message type is gameHasPaused, handed setHasPaused should be called with true', () => {
        const mockData = {
            type: MessageTypes.gameHasPaused,
        };

        handleMessageData({
            ...defaultData,
            data: mockData as MessageData,
            socket: fakeSocket,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(setHasPaused).toHaveBeenLastCalledWith(true);
    });

    it('when message type is gameHasResumed, handed setHasPaused should be called with false', () => {
        const mockData = {
            type: MessageTypes.gameHasResumed,
        };

        handleMessageData({
            ...defaultData,
            data: mockData as MessageData,
            socket: fakeSocket,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(setHasPaused).toHaveBeenLastCalledWith(false);
    });

    it('when message type is gameHasStopped, back to L should be called', () => {
        const mockData = {
            type: MessageTypes.gameHasStopped,
        };

        handleMessageData({
            ...defaultData,
            data: mockData as MessageData,
            socket: fakeSocket,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(resetGame).toHaveBeenCalledTimes(1);
    });

    it('when message type is gameHasStopped, history push should be called', () => {
        const mockData = {
            type: MessageTypes.gameHasStopped,
        };

        const history = createMemoryHistory();

        handleMessageData({
            ...defaultData,
            data: mockData as MessageData,
            socket: fakeSocket,
            dependencies: {
                setPlayerRank,
                setPlayerAdmin,
                setPlayerNumber,
                setObstacle,
                setGameStarted,
                setPlayerFinished,
                setHasPaused,
                resetGame,
                resetPlayer,
                history,
            },
        });

        expect(history.location).toHaveProperty('pathname', `/controller/${defaultData.roomId}/lobby`);
    });
});
