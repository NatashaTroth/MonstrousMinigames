import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import {
    useVoteForFinalPhotosHandler,
    voteForFinalPhotosHandler,
} from '../../../domain/game3/controller/gameState/voteForFinalPhotosHandler';
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

describe('useVoteForFinalPhotosHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const voteForFinalPhotosHandler = jest.fn();
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useVoteForFinalPhotosHandler(socket, voteForFinalPhotosHandler));

        expect(voteForFinalPhotosHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const voteForFinalPhotosHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => useVoteForFinalPhotosHandler(socket, voteForFinalPhotosHandler));

        expect(voteForFinalPhotosHandler).toHaveBeenCalledTimes(0);
    });
});
