import { SocketIOAdapter } from '../../../domain/socket/SocketIOAdapter';

describe('SocketIOAdapter', () => {
    const roomId = 'SDFS';
    const device = 'controller';

    it('when creating socket, connect should be called', () => {
        const socket = new SocketIOAdapter(roomId, device);
        const spy = jest.spyOn(socket, 'connect');

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('when calling listen on socket, waitUntilConnected should be called', () => {
        const socket = new SocketIOAdapter(roomId, device);
        const spy = jest.spyOn(socket, 'waitUntilConnected');
        const callback = jest.fn();
        socket.listen(callback);

        expect(spy).toHaveBeenCalledTimes(1);
    });
});
