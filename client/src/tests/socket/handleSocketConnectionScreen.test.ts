import { createMemoryHistory } from 'history';

import {
    HandleSocketConnDependencies,
    handleSocketConnection,
} from '../../domain/socket/screen/handleSocketConnection';

describe('Screen Socket Connection', () => {
    it('handed setRoomId function should be called with handed roomId', () => {
        const roomId = 'ABCD';
        const history = createMemoryHistory();
        const setRoomId = jest.fn();
        const dependencies: HandleSocketConnDependencies = {
            setScreenSocket: jest.fn(),
            setHasPaused: jest.fn(),
            setScreenAdmin: jest.fn(),
            setScreenState: jest.fn(),
            setChosenGame: jest.fn(),
            setTopicMessage: jest.fn(),
            setVoteForPhotoMessage: jest.fn(),
            setRoomId,
            setRoundIdx: jest.fn(),
            setVotingResults: jest.fn(),
            setFinalRoundCountdownTime: jest.fn(),
            history,
            setPresentFinalPhotos: jest.fn(),
            handleConnectedUsersMessage: jest.fn(),
            handleGameHasFinishedMessage: jest.fn(),
            handleGameHasResetMessage: jest.fn(),
            handleGameHasStoppedMessage: jest.fn(),
            handleGameStartedMessage: jest.fn(),
            handleStartPhaserGameMessage: jest.fn(),
            handleStartSheepGameMessage: jest.fn(),
        };

        handleSocketConnection(roomId, 'Test', dependencies);

        expect(setRoomId).toHaveBeenLastCalledWith(roomId);
    });
});
