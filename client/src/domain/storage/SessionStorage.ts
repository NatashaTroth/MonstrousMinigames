import { Storage } from './Storage';

export class SessionStorage implements Storage {
    getItem(key: string) {
        return global.sessionStorage.getItem(key);
    }

    setItem(key: string, value: string | number) {
        global.sessionStorage.setItem(key, String(value));
    }

    removeItem(key: string) {
        global.sessionStorage.removeItem(key);
    }
}

export const sessionStorage = new SessionStorage();
