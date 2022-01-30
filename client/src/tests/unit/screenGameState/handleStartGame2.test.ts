import handleStartGame2 from '../../../domain/game2/screen/gameState/handleStartGame2';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypesGame2 } from '../../../utils/constants';

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('handleStartGame2', () => {
    it('startSheepGame should be emitted to socket', () => {
        const screenSocket = new FakeInMemorySocket();
        const roomId = 'ABCD';
        const userId = '1';

        global.sessionStorage.setItem('roomId', roomId);
        global.sessionStorage.setItem('userId', userId);

        handleStartGame2(screenSocket);

        expect(screenSocket.emitedVals).toStrictEqual([
            {
                type: MessageTypesGame2.startSheepGame,
                roomId,
                userId,
            },
        ]);
    });
});
