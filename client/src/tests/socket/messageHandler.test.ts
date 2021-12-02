import { InMemorySocketFake } from '../../domain/socket/InMemorySocketFake';
import messageHandler from '../../domain/socket/messageHandler';

describe('messageHandler', () => {
    it('when message succeeds typeguard callback is executed', () => {
        interface Message {
            type: 'test';
        }

        const testTypeGuard = (data: any): data is Message => true;

        const message = {
            type: 'test',
        };

        const socket = new InMemorySocketFake();
        const callback = jest.fn();

        const userInitHandler = messageHandler(testTypeGuard, callback);
        userInitHandler(socket);

        socket.emit(message);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('when message fails typeguard callback is executed', () => {
        interface Message {
            type: 'testMock';
        }

        const testTypeGuard = (data: any): data is Message => false;

        const message = {
            type: 'test',
        };

        const socket = new InMemorySocketFake();
        const callback = jest.fn();

        const userInitHandler = messageHandler(testTypeGuard, callback);
        userInitHandler(socket);

        socket.emit(message);

        expect(callback).toHaveBeenCalledTimes(0);
    });
});
