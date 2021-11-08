import { handleResume, handleStartGame } from '../../../domain/game1/screen/components/MainScene';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypes } from '../../../utils/constants';

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
