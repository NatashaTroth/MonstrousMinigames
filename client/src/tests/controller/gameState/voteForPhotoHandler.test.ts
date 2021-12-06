import { createMemoryHistory } from 'history';

import { voteForPhotoHandler } from '../../../domain/game3/controller/gameState/voteForPhotoHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { VoteForPhotoMessage } from '../../../domain/typeGuards/game3/voteForPhotos';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('voteForPhotoHandler', () => {
    const roomId = 'ANES';
    const message: VoteForPhotoMessage = {
        type: MessageTypesGame3.voteForPhotos,
        roomId,
        photoUrls: [],
        countdownTime: 3000,
    };

    it('when VoteForPhotoMessage is written, setVoteForPhotoMessage should be called', async () => {
        const history = createMemoryHistory();
        const setVoteForPhotoMessage = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = voteForPhotoHandler({ history, setVoteForPhotoMessage });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setVoteForPhotoMessage).toHaveBeenCalledTimes(1);
    });
});
