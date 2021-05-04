import { persistUser } from '../../utils/persistUser';

beforeAll(() => {
    global.sessionStorage = new LocalStorageMock();
    global.localStorage = new LocalStorageMock();
});
describe('persistUser function', () => {
    const mockData = {
        name: 'User',
        userId: '1',
        roomId: '1',
        isAdmin: true,
        number: 1,
    };

    const setPlayerAdmin = jest.fn();
    const setPlayerNumber = jest.fn();

    it('handed setPlayerAdmin function should be called with passed isAdmin data', () => {
        persistUser(mockData, { setPlayerAdmin, setPlayerNumber });

        expect(setPlayerAdmin).toHaveBeenLastCalledWith(mockData.isAdmin);
    });

    it('handed function should be called with passed data', () => {
        persistUser(mockData, { setPlayerAdmin, setPlayerNumber });

        expect(setPlayerNumber).toHaveBeenLastCalledWith(mockData.number);
    });

    it('handed userName should be persisted to local storage', () => {
        global.localStorage.clear();
        persistUser(mockData, { setPlayerAdmin, setPlayerNumber });
        expect(global.localStorage.getItem('name')).toBe(mockData.name);
    });

    it('handed userId should be persisted to session storage', () => {
        global.sessionStorage.clear();

        persistUser(mockData, { setPlayerAdmin, setPlayerNumber });
        expect(global.sessionStorage.getItem('userId')).toBe(mockData.userId);
    });

    it('handed roomId should be persisted to session storage', () => {
        global.sessionStorage.clear();

        persistUser(mockData, { setPlayerAdmin, setPlayerNumber });
        expect(global.sessionStorage.getItem('roomId')).toBe(mockData.roomId);
    });
});

interface StorageMock {
    length: number;
    key: (index: number) => string | null;
    store: { [key: string]: string };
}
class LocalStorageMock implements StorageMock {
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
