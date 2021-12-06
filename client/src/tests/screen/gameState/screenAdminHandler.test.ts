import { screenAdminHandler } from '../../../domain/commonGameState/screen/screenAdminHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { ScreenAdminMessage } from '../../../domain/typeGuards/screenAdmin';
import { MessageTypes } from '../../../utils/constants';

describe('screenAdminHandler', () => {
    const roomId = 'ANES';
    const message: ScreenAdminMessage = {
        type: MessageTypes.screenAdmin,
        isAdmin: true,
    };

    it('when ScreenAdminMessage is written, setScreenAdmin should be called', async () => {
        const setScreenAdmin = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = screenAdminHandler({ setScreenAdmin });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setScreenAdmin).toHaveBeenCalledTimes(1);
    });
});
