import { createMemoryHistory } from 'history';

import { startSheepGameHandler } from '../../../domain/game2/screen/gameState/startSheepGameHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { StartSheepGameMessage } from '../../../domain/typeGuards/startSheepGame';
import { MessageTypesGame2 } from '../../../utils/constants';

describe('startSheepGameHandler', () => {
    const roomId = 'ANES';
    const message: StartSheepGameMessage = {
        type: MessageTypesGame2.startSheepGame,
        countdownTime: 3000,
    };

    it('when VoteForPhotoMessage is written, setSheepGameStarted should be called', async () => {
        const setSheepGameStarted = jest.fn();
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        const withDependencies = startSheepGameHandler({ setSheepGameStarted, history });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setSheepGameStarted).toHaveBeenCalledTimes(1);
    });
});
