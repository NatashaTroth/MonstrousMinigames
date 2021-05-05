import { IUserInitMessage } from '../../contexts/ControllerSocketContextProvider';
import { Storage } from '../storage/Storage';

export function persistUser(
    data: IUserInitMessage,
    dependencies: {
        localStorage: Storage;
        sessionStorage: Storage;
        setPlayerAdmin: (val: boolean) => void;
        setPlayerNumber: (val: number) => void;
    }
) {
    const { setPlayerAdmin, setPlayerNumber } = dependencies;
    sessionStorage.setItem('userId', data.userId || '');
    localStorage.setItem('name', data.name || '');
    sessionStorage.setItem('roomId', data.roomId || '');

    setPlayerAdmin(data.isAdmin);
    setPlayerNumber(data.number);
}
