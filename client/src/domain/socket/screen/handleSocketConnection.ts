import { SocketIOAdapter } from '../SocketIOAdapter';
import { handleSetSocket, HandleSetSocketDependencies } from './handleSetSocket';

export interface HandleSocketConnDependencies extends HandleSetSocketDependencies {
    setRoomId: (val: string) => void;
}

export async function handleSocketConnection(
    roomId: string,
    route: string,
    dependencies: HandleSocketConnDependencies
) {
    const { setRoomId } = dependencies;

    setRoomId(roomId);
    sessionStorage.setItem('roomId', roomId);

    handleSetSocket(new SocketIOAdapter(roomId, 'screen'), roomId, dependencies, route);
}
