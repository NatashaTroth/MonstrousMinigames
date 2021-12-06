import { InMemorySocketFake } from '../../domain/socket/InMemorySocketFake';
import messageHandler from '../../domain/socket/messageHandler';

describe('messageHandler', () => {
    interface Message {
        type: 'test';
    }

    const message = {
        type: 'test',
    };
    const roomId = 'SFEF';

    it('when message succeeds typeguard callback is executed', () => {
        const testTypeGuard = (data: any): data is Message => true;

        const socket = new InMemorySocketFake();
        const callback = jest.fn();

        const userInitHandler = messageHandler(testTypeGuard, callback)({});
        userInitHandler(socket, roomId);

        socket.emit(message);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('when message fails typeguard callback is executed', () => {
        const testTypeGuard = (data: any): data is Message => false;

        const socket = new InMemorySocketFake();
        const callback = jest.fn();

        const userInitHandler = messageHandler(testTypeGuard, callback)({});
        userInitHandler(socket, roomId);

        socket.emit(message);

        expect(callback).toHaveBeenCalledTimes(0);
    });
});
