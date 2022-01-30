import { sendMovement } from '../../../domain/game1/controller/gameState/sendMovement';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('sendMovement function', () => {
    it('when game is running, runForward should be emitted', () => {
        const socket = new FakeInMemorySocket();

        sendMovement(socket, false);

        expect(socket.emitedVals).toEqual([{ type: MessageTypesGame1.runForward }]);
    });

    it('when game is paused, nothing should be emitted', () => {
        const socket = new FakeInMemorySocket();

        sendMovement(socket, true);

        expect(socket.emitedVals).toEqual([]);
    });
});
