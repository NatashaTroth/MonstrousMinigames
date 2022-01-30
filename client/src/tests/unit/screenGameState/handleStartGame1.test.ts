import handleStartGame1 from '../../../domain/game1/screen/gameState/handleStartGame1';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypesGame1 } from '../../../utils/constants';

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('handleStartGame1', () => {
    it('startPhaserGame should be emitted to socket', () => {
        const screenSocket = new FakeInMemorySocket();
        const roomId = 'ABCD';
        const userId = '1';

        global.sessionStorage.setItem('roomId', roomId);
        global.sessionStorage.setItem('userId', userId);

        handleStartGame1(screenSocket);

        expect(screenSocket.emitedVals).toStrictEqual([
            {
                type: MessageTypesGame1.startPhaserGame,
                roomId,
                userId,
            },
        ]);
    });
});
