import { createMemoryHistory } from 'history';

import { presentFinalPhotosHandler } from '../../../domain/game3/controller/gameState/presentFinalPhotosHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { PresentFinalPhotosMessage } from '../../../domain/typeGuards/game3/presentFinalPhotos';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('presentFinalPhotosHandler', () => {
    const roomId = 'ANES';
    const message: PresentFinalPhotosMessage = {
        type: MessageTypesGame3.presentFinalPhotos,
        roomId,
        photoUrls: [],
        countdownTime: 3000,
        photographerId: 'FSSD',
        name: 'test',
    };

    it('when PresentFinalPhotosMessage is written, setPresentFinalPhotos should be called', async () => {
        const setPresentFinalPhotos = jest.fn();
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        const withDependencies = presentFinalPhotosHandler({ setPresentFinalPhotos, history });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setPresentFinalPhotos).toHaveBeenCalledTimes(1);
    });
});
