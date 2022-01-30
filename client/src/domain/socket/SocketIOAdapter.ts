import { stringify } from "query-string";
import io from "socket.io-client";

import { localBackend, localDevelopment } from "../../utils/constants";
import { Socket } from "./Socket";

interface Params {
    roomId: string;
    name?: string;
    userId?: string;
}

export class SocketIOAdapter implements Socket {
    public socket: SocketIOClient.Socket;
    public connectionPromise: Promise<void>;

    constructor(public roomId: string, public device: 'controller' | 'screen', public name?: string) {
        this.socket = this.connect();
        this.connectionPromise = new Promise(resolve => {
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

    unlisten<T>(callback: (val: T) => void) {
        this.socket.off('message', callback);
    }

    waitUntilConnected() {
        return this.connectionPromise;
    }

    connect() {
        const params: Params = { roomId: this.roomId };

        if (this.device === 'controller') {
            params.name = this.name;
            params.userId = sessionStorage.getItem('userId') || '';
        }

        return io(
            `${localDevelopment ? localBackend : process.env.REACT_APP_BACKEND_URL}${this.device}?${stringify(params)}`,
            {
                secure: true,
                reconnection: true,
                rejectUnauthorized: false,
                reconnectionDelayMax: 10000,
                transports: ['websocket'],
                upgrade: false,
            }
        );
    }
}
