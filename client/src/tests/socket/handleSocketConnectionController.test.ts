import { createMemoryHistory } from 'history';

import { handleSocketConnection } from '../../domain/socket/controller/handleSocketConnection';

describe('Controller Socket Connection', () => {
    it('handed setRoomId function should be called with handed roomId', () => {
        const roomId = 'ABCD';
        const history = createMemoryHistory();
        const setRoomId = jest.fn();
        const dependencies = {
            setRoomId,
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
            setVoteForPhotoMessage: jest.fn(),
            setRoundIdx: jest.fn(),
            setCountdownTime: jest.fn(),
            setTopicMessage: jest.fn(),
            setSheepGameStarted: jest.fn(),
            setVotingResults: jest.fn(),
            setFinalRoundCountdownTime: jest.fn(),
        };

        handleSocketConnection(roomId, 'Test', false, dependencies);

        expect(setRoomId).toHaveBeenLastCalledWith(roomId);
    });
});
