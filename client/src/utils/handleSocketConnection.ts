import { HandleMessageDataDependencies } from './handleMessageData';
import { handleSetControllerSocket } from './handleSetControllerSocket';
import { Socket } from './socket/Socket';
import { SocketIOAdapter } from './socket/SocketIOAdapter';
import { ClickRequestDeviceMotion } from './user/permissions';
import { window } from './window/WindowAdapter';

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

    const permission = await ClickRequestDeviceMotion(window);
    if (permission) {
        setPermissionGranted(permission);
    }

    setRoomId(roomId || '');

    handleSetControllerSocket(new SocketIOAdapter(name, roomId), roomId || '', playerFinished, dependencies);
}
