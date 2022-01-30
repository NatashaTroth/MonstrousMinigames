import { SocketIOAdapter } from "../../../domain/socket/SocketIOAdapter";

describe('SocketIOAdapter', () => {
    const roomId = 'SDFS';
    const device = 'controller';

    it('when calling emit on socket, waitUntilConnected should be called', () => {
        const socket = new SocketIOAdapter(roomId, device);
        const spy = jest.spyOn(socket, 'waitUntilConnected');
        const callback = jest.fn();
        socket.emit(callback);

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
