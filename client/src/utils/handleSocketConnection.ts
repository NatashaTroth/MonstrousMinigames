import { HandleMessageDataDependencies } from './handleMessageData';
import { handleSetControllerSocket } from './handleSetControllerSocket';
import { ClickRequestDeviceMotion } from './permissions';
import { Socket } from './socket/Socket';
import { SocketIOAdapter } from './socket/SocketIOAdapter';

interface HandleSocketConnDependencies extends HandleMessageDataDependencies {
    setControllerSocket: (socket: Socket) => void;
    setPermissionGranted: (val: boolean) => void;
    setRoomId: (val: string) => void;
}

export async function handleSocketConnection(
    roomId: string,
    name: string,
    playerFinished: boolean,
    dependencies: HandleSocketConnDependencies
) {
    const { setPermissionGranted, setRoomId } = dependencies;

    const permission = await ClickRequestDeviceMotion();
    if (permission) {
        setPermissionGranted(permission);
    }

    setRoomId(roomId || '');

    handleSetControllerSocket(new SocketIOAdapter(name, roomId), roomId || '', playerFinished, dependencies);
}
