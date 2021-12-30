import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import {
    useVoteForPhotoHandler,
    voteForPhotoHandler,
} from '../../../domain/game3/controller/gameState/voteForPhotoHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
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
        const socket = new FakeInMemorySocket();

        const withDependencies = voteForPhotoHandler({ history, setVoteForPhotoMessage });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setVoteForPhotoMessage).toHaveBeenCalledTimes(1);
    });
});

describe('useVoteForPhotoHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const voteForPhotoHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useVoteForPhotoHandler(socket, voteForPhotoHandler));

        expect(voteForPhotoHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should be called if there is no roomId', () => {
        const voteForPhotoHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useVoteForPhotoHandler(socket, voteForPhotoHandler));

        expect(voteForPhotoHandler).toHaveBeenCalledTimes(0);
    });
});
