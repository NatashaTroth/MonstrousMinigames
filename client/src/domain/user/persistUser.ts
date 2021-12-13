import { Storage } from '../storage/Storage';
import { UserInitMessage } from '../typeGuards/userInit';

export function persistUser(dependencies: { localStorage: Storage; sessionStorage: Storage }) {
    return (data: UserInitMessage) => {
        sessionStorage.setItem('userId', data.userId);
        localStorage.setItem('name', data.name);
        sessionStorage.setItem('roomId', data.roomId);
    };
}
