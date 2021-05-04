import { MessageData } from '../contexts/ControllerSocketContextProvider';
import { MessageTypes, Obstacles } from './constants';
import { handleMessageData } from './handleMessageData';
import { handleResetGame } from './handleResetGame';

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
    const fakeSocket = '' as any;

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
            },
        });

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });

    // TODO test History
    // it('when message type is gameHasReset, history push should be called', () => {
    //     const mockData = {
    //         type: MessageTypes.gameHasReset,
    //     };

    //     handleMessageData({
    //         ...defaultData,
    //         data: mockData as MessageData,
    //         dependencies: {
    //             setPlayerRank,
    //             setPlayerAdmin,
    //             setPlayerNumber,
    //             setObstacle,
    //             setGameStarted,
    //             setPlayerFinished,
    //         },
    //     });

    //     expect(history).toHaveBeenLastCalledWith(`/controller/${defaultData.roomId}/lobby`);
    // });

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
            },
        });

        expect(setHasPaused).toHaveBeenLastCalledWith(false);
    });

    it('when message type is gameHasStopped, handed handleResetGame should be called', () => {
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
            },
        });

        expect(handleResetGame).toHaveBeenCalledTimes(1);
    });
});
