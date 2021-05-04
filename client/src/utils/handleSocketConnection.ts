import { stringify } from 'query-string';

import { HandleMessageDataDependencies } from './handleMessageData';
import { handleSetControllerSocket } from './handleSetControllerSocket';
import { ClickRequestDeviceMotion } from './permissions';

interface HandleSocketConnDependencies extends HandleMessageDataDependencies {
    setControllerSocket: (socker: SocketIOClient.Socket | undefined) => void;
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

    const controllerSocket = io(
        `${process.env.REACT_APP_BACKEND_URL}controller?${stringify({
            name: name,
            roomId: roomId,
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

    setRoomId(roomId || '');

    controllerSocket.on('connect', () => {
        if (controllerSocket) {
            handleSetControllerSocket(controllerSocket, roomId || '', playerFinished, dependencies);
        }
    });
}
