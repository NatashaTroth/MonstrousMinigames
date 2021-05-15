import { Socket } from './socket/Socket';

class ScreenSocket {
    private static instance: ScreenSocket;
    public socket: Socket;

    private constructor(val: Socket) {
        this.socket = val;
    }

    public static getInstance(val: Socket): ScreenSocket {
        if (!ScreenSocket.instance) {
            ScreenSocket.instance = new ScreenSocket(val);
        }

        return ScreenSocket.instance;
    }
}

export default ScreenSocket;
