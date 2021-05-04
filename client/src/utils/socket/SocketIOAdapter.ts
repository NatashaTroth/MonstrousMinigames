import { stringify } from 'query-string';
import io from 'socket.io-client';

import { Socket } from './Socket';

export class SocketIOAdapter implements Socket {
    public socket: SocketIOClient.Socket;
    public connectionPromise: Promise<void>;

    constructor(public name: string, public roomId: string) {
        this.socket = this.connect();
        this.connectionPromise = new Promise(resolve => {
            // TODO check error case
            this.socket.on('connect', () => resolve());
        });
    }

    async listen<T>(callback: (val: T) => void) {
        await this.waitUntilConnected();
        this.socket.on('message', callback);
    }

    async emit<T>(val: T) {
        await this.waitUntilConnected();
        this.socket.emit('message', val);
    }

    waitUntilConnected() {
        return this.connectionPromise;
    }

    connect() {
        return io(
            `${process.env.REACT_APP_BACKEND_URL}controller?${stringify({
                name: this.name,
                roomId: this.roomId,
                userId: sessionStorage.getItem('userId') || '',
            })}`,
            {
                secure: true,
                reconnection: true,
                rejectUnauthorized: false,
                reconnectionDelayMax: 10000,
                transports: ['websocket'],
            }
        );
    }
}
