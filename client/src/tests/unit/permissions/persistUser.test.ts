import { UserInitMessage } from '../../../domain/typeGuards/userInit';
import { persistUser } from '../../../domain/user/persistUser';
import { MessageTypes } from '../../../utils/constants';
import { LocalStorageFake } from '../../integration/storage/LocalFakeStorage';

beforeEach(() => {
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
        screenState: 'lobby',
    };

    it('handed userName should be persisted to local storage', () => {
        const persistUserWithDependencies = persistUser({
            localStorage: new LocalStorageFake(),
            sessionStorage: new LocalStorageFake(),
        });

        persistUserWithDependencies(mockData);
        expect(global.localStorage.getItem('name')).toBe(mockData.name);
    });

    it('handed userId should be persisted to session storage', () => {
        const persistUserWithDependencies = persistUser({
            localStorage: new LocalStorageFake(),
            sessionStorage: new LocalStorageFake(),
        });

        persistUserWithDependencies(mockData);
        expect(global.sessionStorage.getItem('userId')).toBe(mockData.userId);
    });

    it('handed roomId should be persisted to session storage', () => {
        const persistUserWithDependencies = persistUser({
            localStorage: new LocalStorageFake(),
            sessionStorage: new LocalStorageFake(),
        });

        persistUserWithDependencies(mockData);
        expect(global.sessionStorage.getItem('roomId')).toBe(mockData.roomId);
    });
});
