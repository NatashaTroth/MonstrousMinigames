import { SocketIOAdapter } from '../SocketIOAdapter';
import { handleSetSocket, HandleSetSocketDependencies } from './handleSetSocket';

interface HandleSocketConnDependencies extends HandleSetSocketDependencies {
    setRoomId: (val: string) => void;
}

export async function handleSocketConnection(
    roomId: string,
    name: string,
    playerFinished: boolean,
    dependencies: HandleSocketConnDependencies
) {
    const { setRoomId } = dependencies;

    setRoomId(roomId);

    handleSetSocket(new SocketIOAdapter(roomId, 'controller', name), roomId, playerFinished, dependencies);
}
