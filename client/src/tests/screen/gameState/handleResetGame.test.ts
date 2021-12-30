import { handleResetGame } from '../../../domain/commonGameState/screen/handleResetGame';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypes } from '../../../utils/constants';

describe('handleResetGame', () => {
    it('backToLobby should be emitted', () => {
        const socket = new FakeInMemorySocket();

        handleResetGame(socket);

        expect(socket.emitedVals).toEqual([{ type: MessageTypes.backToLobby }]);
    });
});
