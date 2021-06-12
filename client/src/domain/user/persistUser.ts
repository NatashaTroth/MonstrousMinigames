import { Storage } from '../storage/Storage';
import { UserInitMessage } from '../typeGuards/userInit';

export function persistUser(
    data: UserInitMessage,
    dependencies: {
        localStorage: Storage;
        sessionStorage: Storage;
        setPlayerAdmin: (val: boolean) => void;
        setPlayerNumber: (val: number) => void;
        setName: (val: string) => void;
        setUserId: (val: string) => void;
    }
) {
    const { setPlayerAdmin, setPlayerNumber, setName, setUserId } = dependencies;
    sessionStorage.setItem('userId', data.userId || '');
    localStorage.setItem('name', data.name || '');
    sessionStorage.setItem('roomId', data.roomId || '');

    setName(data.name);
    setPlayerAdmin(data.isAdmin);
    setPlayerNumber(data.number);
    setUserId(data.userId);
}
