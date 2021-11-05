import { createMemoryHistory } from 'history';

import { InMemorySocketFake } from '../../socket/InMemorySocketFake';
import { handleGameHasStoppedMessage } from './handleGameHasStoppedMessage';

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
