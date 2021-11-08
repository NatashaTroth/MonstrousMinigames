import { createMemoryHistory } from 'history';

import { handleGameHasStoppedMessage } from '../../../domain/commonGameState/screen/handleGameHasStoppedMessage';
import { screenLobbyRoute } from '../../../utils/routes';

describe('handleGameHasStoppedMessage', () => {
    const roomId = '1234';

    it('when message type is gameHasStopped, history push should be called', () => {
        const history = createMemoryHistory();

        handleGameHasStoppedMessage({ roomId, dependencies: { history } });

        expect(history.location).toHaveProperty('pathname', screenLobbyRoute(roomId));
    });
});
