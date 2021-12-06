import { finalRoundCountdownHandler } from '../../../domain/game3/controller/gameState/finalRoundCountdownHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { FinalRoundCountdownMessage } from '../../../domain/typeGuards/game3/finalRoundCountdown';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('finalRoundCountdownHandler', () => {
    const roomId = 'ANES';
    const message: FinalRoundCountdownMessage = {
        type: MessageTypesGame3.finalRoundCountdown,
        roomId,
        countdownTime: 3000,
    };

    it('when FinalRoundCountdownMessage is written, setFinalRoundCountdownTime should be called', async () => {
        const setFinalRoundCountdownTime = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = finalRoundCountdownHandler({ setFinalRoundCountdownTime });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setFinalRoundCountdownTime).toHaveBeenCalledTimes(1);
    });
});
