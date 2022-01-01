import { sendUserReady } from '../../../domain/commonGameState/controller/sendUserReady';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypes } from '../../../utils/constants';

describe('sendUserReady function', () => {
    it('userReady should be emitted', () => {
        const socket = new FakeInMemorySocket();

        sendUserReady(socket);

        expect(socket.emitedVals).toEqual([{ type: MessageTypes.userReady }]);
    });
});
