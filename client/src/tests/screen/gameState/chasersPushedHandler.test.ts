import { chasersPushedHandler } from '../../../domain/game1/screen/gameState/chasersPushedHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { ChasersPushedMessage } from '../../../domain/typeGuards/game1/chasersPushed';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('chasersPushedHandler Game1', () => {
    const message: ChasersPushedMessage = {
        type: MessageTypesGame1.chasersPushed,
    };

    it('when message type is chasersPushed, renderWind should be called', async () => {
        const socket = new InMemorySocketFake();
        const renderWind = jest.fn();

        const withDependencies = chasersPushedHandler({ players: [{ renderer: { renderWind } }] });

        withDependencies(socket);
        await socket.emit(message);

        expect(renderWind).toHaveBeenCalledTimes(1);
    });
});
