import { exceededMaxChaserPushesHandler } from '../../../domain/game1/controller/gameState/exceededMaxChaserPushesHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { ExceededMaxChaserPushesMessage } from '../../../domain/typeGuards/game1/exceededMaxChaserPushes';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('exceededMaxChaserPushesHandler', () => {
    const mockData: ExceededMaxChaserPushesMessage = {
        type: MessageTypesGame1.exceededNumberOfChaserPushes,
    };

    it('handed setExceeded should be called', async () => {
        const setExceededChaserPushes = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = exceededMaxChaserPushesHandler({
            setExceededChaserPushes,
        });

        withDependencies(socket, 'PSVS');

        await socket.emit(mockData);

        expect(setExceededChaserPushes).toHaveBeenCalledWith(true);
    });
});
