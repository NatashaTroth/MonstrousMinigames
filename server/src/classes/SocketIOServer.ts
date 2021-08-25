import { singleton } from 'tsyringe';
import { Server as SocketIO } from 'socket.io';
import Server from './Server';

@singleton()
class SocketIOServer {
    public readonly socketIo: SocketIO;

    constructor(private readonly expressServer: Server) {
        this.socketIo = new SocketIO(this.expressServer.httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
    }
}

export default SocketIOServer;
