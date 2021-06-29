import { MessageTypes } from '../../../utils/constants';
import { InMemorySocketFake } from '../../socket/InMemorySocketFake';
import { sendUserReady } from './sendUserReady';

describe('sendUserReady function', () => {
    it('userReady should be emitted', () => {
        const socket = new InMemorySocketFake();

        sendUserReady(socket);

        expect(socket.emitedVals).toEqual([{ type: MessageTypes.userReady }]);
    });
});
