import { InMemorySocketFake } from '../../domain/socket/InMemorySocketFake';
import { MessageSocket } from '../../domain/socket/MessageSocket';

describe('InMemorySocket', () => {
    it('when data was written, registered callback is called', async () => {
        const socket = new InMemorySocketFake();

        const callback = jest.fn();
        await socket.listen(callback);
        await socket.emit('data');
        expect(callback).toHaveBeenLastCalledWith('data');
    });

    it('when relevant message was written, then listen is executed', async () => {
        const socket = new InMemorySocketFake();

        const callback = jest.fn();

        const isString = (arg: string | number): arg is string => typeof arg === 'string';
        const messageSocket = new MessageSocket(isString, socket);

        await messageSocket.listen(callback);
        await messageSocket.emit('data');
        expect(callback).toHaveBeenLastCalledWith('data');
    });

    it('when relevant message was written, then listen is executed', async () => {
        const socket = new InMemorySocketFake();

        const callback = jest.fn();

        const isString = (arg: string | number): arg is string => typeof arg === 'string';
        const messageSocket = new MessageSocket(isString, socket);

        await messageSocket.listen(callback);
        await messageSocket.emit((1 as unknown) as string);
        expect(callback).toHaveBeenCalledTimes(0);
    });

    it('when relevant message was written, then listen is executed', async () => {
        const socket = new InMemorySocketFake();

        const callback = jest.fn();

        const isString = (arg: string | number): arg is string => typeof arg === 'string';
        const messageSocket = new MessageSocket(isString, socket);

        await messageSocket.listen(callback);
        await messageSocket.unlisten(callback);
        await messageSocket.emit('data');
        expect(callback).toHaveBeenCalledTimes(0);
    });
});
