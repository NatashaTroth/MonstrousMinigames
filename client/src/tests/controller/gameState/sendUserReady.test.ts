import { sendUserReady } from '../../../domain/commonGameState/controller/sendUserReady';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypes } from '../../../utils/constants';

describe('sendUserReady function', () => {
    it('userReady should be emitted', () => {
        const socket = new InMemorySocketFake();

        sendUserReady(socket);

        expect(socket.emitedVals).toEqual([{ type: MessageTypes.userReady }]);
    });
});
