import { SocketIOAdapter } from '../../socket/SocketIOAdapter';
import { ClickRequestDeviceMotion } from '../../user/permissions';
import { window } from '../../window/WindowAdapter';
import { handleSetSocket, HandleSetSocketDependencies } from './handleSetSocket';

interface HandleSocketConnDependencies extends HandleSetSocketDependencies {
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

    handleSetSocket(new SocketIOAdapter(roomId, 'controller', name), roomId || '', playerFinished, dependencies);
}
