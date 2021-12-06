import { createMemoryHistory } from 'history';

import { voteForFinalPhotosHandler } from '../../../domain/game3/controller/gameState/voteForFinalPhotosHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { VoteForFinalPhotosMessage } from '../../../domain/typeGuards/game3/voteForFinalPhotos';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('voteForFinalPhotosHandler', () => {
    const roomId = 'ANES';
    const message: VoteForFinalPhotosMessage = {
        type: MessageTypesGame3.voteForFinalPhots,
        roomId,
        countdownTime: 3000,
        photographers: [],
    };

    it('when VoteForFinalPhotosMessage is written, setVoteForPhotoMessage should be called ', async () => {
        const setVoteForPhotoMessage = jest.fn();
        const socket = new InMemorySocketFake();
        const history = createMemoryHistory();

        const withDependencies = voteForFinalPhotosHandler({ setVoteForPhotoMessage, history });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setVoteForPhotoMessage).toHaveBeenCalledTimes(1);
    });
});
