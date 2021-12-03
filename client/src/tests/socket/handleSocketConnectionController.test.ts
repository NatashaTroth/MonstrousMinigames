import {
    HandleSocketConnDependencies,
    handleSocketConnection,
} from '../../domain/socket/controller/handleSocketConnection';

describe('Controller Socket Connection', () => {
    it('handed setRoomId function should be called with handed roomId', () => {
        const roomId = 'ABCD';
        const setRoomId = jest.fn();
        const dependencies: HandleSocketConnDependencies = {
            setRoomId,
            setExceededChaserPushes: jest.fn(),
            setFinalRoundCountdownTime: jest.fn(),
            setPresentFinalPhotos: jest.fn(),
            setRoundIdx: jest.fn(),
            setTopicMessage: jest.fn(),
            setVoteForPhotoMessage: jest.fn(),
            setVotingResults: jest.fn(),
            handleApproachingObstacleMessage: jest.fn(),
            handlePlayerDied: jest.fn(),
            handlePlayerFinishedMessage: jest.fn(),
            handleStunnablePlayers: jest.fn(),
        };

        handleSocketConnection(roomId, 'Test', false, dependencies);

        expect(setRoomId).toHaveBeenLastCalledWith(roomId);
    });
});
