import { MessageTypes } from '../../../../utils/constants';
import { InMemorySocketFake } from '../../../socket/InMemorySocketFake';
import { handleResume, handleStartGame } from './MainScene';

describe('handleResume', () => {
    it('handleResume should emit pauseResume to socket', () => {
        const socket = new InMemorySocketFake();

        handleResume(socket);

        expect(socket.emitedVals).toEqual([{ type: MessageTypes.pauseResume }]);
    });
});

describe('handleStartGame', () => {
    it('handleStartGame should emit startGame to socket', () => {
        const socket = new InMemorySocketFake();
        const roomId = 'ADFS';

        handleStartGame(socket, roomId);

        expect(socket.emitedVals).toEqual([
            {
                type: MessageTypes.startGame,
                roomId,
            },
        ]);
    });
});
