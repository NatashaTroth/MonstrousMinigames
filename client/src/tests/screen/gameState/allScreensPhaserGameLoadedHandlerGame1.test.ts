import { allScreensPhaserGameLoadedHandler } from '../../../domain/game1/screen/gameState/allScreensPhaserGameLoadedHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { AllScreensPhaserGameLoadedMessage } from '../../../domain/typeGuards/game1/allScreensPhaserGameLoaded';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('allScreensPhaserGameLoadedHandler Game1', () => {
    const message: AllScreensPhaserGameLoadedMessage = {
        type: MessageTypesGame1.allScreensPhaserGameLoaded,
    };

    it('when message type is allScreensPhaserGameLoaded, sendCreateNewGame should be called', async () => {
        const socket = new InMemorySocketFake();
        const sendCreateNewGame = jest.fn();

        const withDependencies = allScreensPhaserGameLoadedHandler({ screenAdmin: true, sendCreateNewGame });

        withDependencies(socket);
        await socket.emit(message);

        expect(sendCreateNewGame).toHaveBeenCalledTimes(1);
    });

    it('when message type is allScreensPhaserGameLoaded,when screen is not admin, sendCreateNewGame should not be called', async () => {
        const socket = new InMemorySocketFake();
        const sendCreateNewGame = jest.fn();

        const withDependencies = allScreensPhaserGameLoadedHandler({ screenAdmin: false, sendCreateNewGame });

        withDependencies(socket);
        await socket.emit(message);

        expect(sendCreateNewGame).toHaveBeenCalledTimes(0);
    });
});
