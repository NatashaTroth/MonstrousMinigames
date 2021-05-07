import { HandleMessageDataDependencies } from '../gameState/handleMessageData';
import { ClickRequestDeviceMotion } from '../user/permissions';
import { window } from '../window/WindowAdapter';
import { handleSetControllerSocket } from './handleSetControllerSocket';
import { Socket } from './Socket';
import { SocketIOAdapter } from './SocketIOAdapter';

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

    setRoomId(roomId);

    handleSetControllerSocket(
        new SocketIOAdapter(roomId, 'controller', name),
        roomId || '',
        playerFinished,
        dependencies
    );
}
