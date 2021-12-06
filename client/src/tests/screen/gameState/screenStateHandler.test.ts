import { screenStateHandler } from '../../../domain/commonGameState/screen/screenStateHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { ScreenStateMessage } from '../../../domain/typeGuards/screenState';
import { MessageTypes } from '../../../utils/constants';

describe('screenStateHandler', () => {
    const roomId = 'ANES';
    const message: ScreenStateMessage = {
        type: MessageTypes.screenState,
        state: 'test',
    };

    it('when ScreenStateMessage is written, setScreenState should be called', async () => {
        const setScreenState = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = screenStateHandler({ setScreenState });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setScreenState).toHaveBeenCalledTimes(1);
    });
});
