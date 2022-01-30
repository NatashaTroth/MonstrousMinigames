import { emitKillMessage, getDirectionforPos, handleStop } from '../../../domain/game2/controller/components/Joystick';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypesGame2 } from '../../../utils/constants';

describe('Joystick emitKillMessage', () => {
    it('should emit chooseSheep to socket', async () => {
        const socket = new FakeInMemorySocket();
        const userId = '1';

        await emitKillMessage(userId, socket);

        expect(socket.emitedVals).toEqual([
            {
                type: MessageTypesGame2.chooseSheep,
                userId,
            },
        ]);
    });
});

describe('Joystick handleStop', () => {
    it('should emit movePlayer to socket', async () => {
        const socket = new FakeInMemorySocket();
        const userId = '1';

        await handleStop(userId, socket);

        expect(socket.emitedVals).toEqual([
            {
                type: MessageTypesGame2.movePlayer,
                userId: userId,
                direction: 'C',
            },
        ]);
    });
});

describe('Joystick getDirectionforPos', () => {
    it('should return C when x and y smaller than 20', async () => {
        expect(getDirectionforPos(10, 10)).toEqual('C');
    });

    it('should return C when x and y smaller than 20', async () => {
        expect(getDirectionforPos(10, 10)).toEqual('C');
    });

    it('should return E when x is bigger than 20 and y smaller than 20', async () => {
        expect(getDirectionforPos(40, 10)).toEqual('E');
    });

    it('should return W when x is smaller than -20 and y smaller than 20', async () => {
        expect(getDirectionforPos(-40, 10)).toEqual('W');
    });

    it('should return NE when x is bigger than -35 and 35 and y is bigger than 20', async () => {
        expect(getDirectionforPos(40, 40)).toEqual('NE');
    });

    it('should return NW when x is smaller than -35 and y is bigger than 20', async () => {
        expect(getDirectionforPos(-40, 40)).toEqual('NW');
    });

    it('should return SE when x is bigger than -35 and 35 and y is smaller than -20', async () => {
        expect(getDirectionforPos(40, -40)).toEqual('SE');
    });

    it('should return NS when x is smaller than -35 and y is smaller than -20', async () => {
        expect(getDirectionforPos(-40, -40)).toEqual('SW');
    });
});
