import { Storage } from '../storage/Storage';
import { UserInitMessage } from '../typeGuards/userInit';

export function persistUser(
    data: UserInitMessage,
    dependencies: {
        localStorage: Storage;
        sessionStorage: Storage;
        setPlayerNumber: (val: number) => void;
        setName: (val: string) => void;
        setUserId: (val: string) => void;
        setReady: (val: boolean) => void;
    }
) {
    const { setPlayerNumber, setName, setUserId, setReady } = dependencies;
    sessionStorage.setItem('userId', data.userId || '');
    localStorage.setItem('name', data.name || '');
    sessionStorage.setItem('roomId', data.roomId || '');

    setName(data.name);
    setPlayerNumber(data.number);
    setUserId(data.userId);
    setReady(data.ready);
}
