import { createMemoryHistory } from 'history';

import {
    HandleSocketConnDependencies,
    handleSocketConnection,
} from '../../domain/socket/controller/handleSocketConnection';

describe('Controller Socket Connection', () => {
    it('handed setRoomId function should be called with handed roomId', () => {
        const roomId = 'ABCD';
        const history = createMemoryHistory();
        const setRoomId = jest.fn();
        const dependencies: HandleSocketConnDependencies = {
            history,
            setRoomId: jest.fn(),
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
            handleApproachingObstacleMessage: jest.fn(),
            handleConnectedUsersMessage: jest.fn(),
            handleGameHasFinishedMessage: jest.fn(),
            handleGameHasResetMessage: jest.fn(),
            handleGameHasStoppedMessage: jest.fn(),
            handleGameStartedMessage: jest.fn(),
            handleObstacleMessage: jest.fn(),
            handlePlayerDied: jest.fn(),
            handlePlayerFinishedMessage: jest.fn(),
            handleStunnablePlayers: jest.fn(),
            handleUserInitMessage: jest.fn(),
        };

        handleSocketConnection(roomId, 'Test', false, dependencies);

        expect(setRoomId).toHaveBeenLastCalledWith(roomId);
    });
});
