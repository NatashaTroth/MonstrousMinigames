import { MessageTypes } from '../../../utils/constants';
import { InMemorySocketFake } from '../../socket/InMemorySocketFake';
import { sendMovement } from './sendMovement';

describe('sendMovement function', () => {
    it('when game is running, runForward should be emitted', () => {
        const socket = new InMemorySocketFake();

        sendMovement(socket, false);

        expect(socket.emitedVals).toEqual([{ type: MessageTypes.runForward }]);
    });

    it('when game is paused, nothing should be emitted', () => {
        const socket = new InMemorySocketFake();

        sendMovement(socket, true);

        expect(socket.emitedVals).toEqual([]);
    });
});
