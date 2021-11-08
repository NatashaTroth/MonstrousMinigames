import { createMemoryHistory } from 'history';

import { handleGameHasStoppedMessage } from '../../../domain/commonGameState/controller/handleGameHasStoppedMessage';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';

describe('handleGameHasStoppedMessage', () => {
    const roomId = '1234';
    const socket = new InMemorySocketFake();

    it('when message type is gameHasStopped, history push should be called', () => {
        const history = createMemoryHistory();

        handleGameHasStoppedMessage({
            socket,
            roomId,
            dependencies: {
                history,
            },
        });

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/lobby`);
    });
});
