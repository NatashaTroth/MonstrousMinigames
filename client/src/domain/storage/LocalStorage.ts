import { Storage } from './Storage';

export class LocalStorage implements Storage {
    getItem(key: string) {
        return global.localStorage.getItem(key);
    }

    setItem(key: string, value: string | number) {
        global.localStorage.setItem(key, String(value));
    }
}

export const localStorage = new LocalStorage();
