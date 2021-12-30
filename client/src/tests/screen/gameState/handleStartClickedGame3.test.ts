import handleStartClickedGame3 from '../../../domain/game3/screen/gameState/handleStartClickedGame3';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypes } from '../../../utils/constants';

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('handleStartClickedGame3 function', () => {
    it('createGame should be emitted first', () => {
        const socket = new FakeInMemorySocket();
        const roomId = 'ABCD';

        global.sessionStorage.setItem('roomId', roomId);

        handleStartClickedGame3(socket);

        expect(socket.emitedVals[0]).toEqual({ type: MessageTypes.createGame, roomId });
    });

    it('startGame should be emitted second', () => {
        const socket = new FakeInMemorySocket();
        const roomId = 'ABCD';

        global.sessionStorage.setItem('roomId', roomId);

        handleStartClickedGame3(socket);

        expect(socket.emitedVals[1]).toEqual({ type: MessageTypes.startGame, roomId });
    });
});
