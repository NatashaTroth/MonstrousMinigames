import { MessageTypes } from '../../utils/constants';
import { Storage } from '../storage/Storage';
import { UserInitMessage } from '../typeGuards/userInit';
import { persistUser } from './persistUser';

beforeAll(() => {
    global.sessionStorage = new LocalStorageFake();
    global.localStorage = new LocalStorageFake();
});

describe('persistUser function', () => {
    const mockData: UserInitMessage = {
        type: MessageTypes.userInit,
        name: 'User',
        userId: '1',
        roomId: '1',
        isAdmin: true,
        number: 1,
        ready: false,
    };

    const setPlayerNumber = jest.fn();
    const setName = jest.fn();
    const setUserId = jest.fn();
    const setReady = jest.fn();

    it('handed function should be called with passed data', () => {
        persistUser(mockData, {
            setPlayerNumber,
            localStorage: new LocalStorageFake(),
            sessionStorage: new LocalStorageFake(),
            setName,
            setUserId,
            setReady,
        });

        expect(setPlayerNumber).toHaveBeenLastCalledWith(mockData.number);
    });

    it('handed userName should be persisted to local storage', () => {
        global.localStorage.clear();
        persistUser(mockData, {
            setPlayerNumber,
            localStorage: new LocalStorageFake(),
            sessionStorage: new LocalStorageFake(),
            setName,
            setUserId,
            setReady,
        });
        expect(global.localStorage.getItem('name')).toBe(mockData.name);
    });

    it('handed userId should be persisted to session storage', () => {
        global.sessionStorage.clear();

        persistUser(mockData, {
            setPlayerNumber,
            localStorage: new LocalStorageFake(),
            sessionStorage: new LocalStorageFake(),
            setName,
            setUserId,
            setReady,
        });
        expect(global.sessionStorage.getItem('userId')).toBe(mockData.userId);
    });

    it('handed roomId should be persisted to session storage', () => {
        global.sessionStorage.clear();

        persistUser(mockData, {
            setPlayerNumber,
            localStorage: new LocalStorageFake(),
            sessionStorage: new LocalStorageFake(),
            setName,
            setUserId,
            setReady,
        });
        expect(global.sessionStorage.getItem('roomId')).toBe(mockData.roomId);
    });
});

class LocalStorageFake implements Storage {
    store: { [key: string]: string } = {};
    length = 0;

    clear() {
        this.store = {};
    }

    getItem(key: string) {
        return this.store[key] || null;
    }

    setItem(key: string, value: string | number) {
        this.store[key] = String(value);
        this.setLength();
    }

    removeItem(key: string) {
        delete this.store[key];
        this.setLength();
    }

    setLength() {
        this.length = Object.keys(this.store).length;
    }

    key(index: number) {
        return String(index);
    }
}
