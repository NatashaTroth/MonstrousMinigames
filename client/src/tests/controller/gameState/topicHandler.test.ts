import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { topicHandler, useTopicHandler } from '../../../domain/game3/controller/gameState/topicHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { NewPhotoTopicMessage } from '../../../domain/typeGuards/game3/newPhotoTopic';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('topicHandler', () => {
    const roomId = 'ANES';
    const message: NewPhotoTopicMessage = {
        type: MessageTypesGame3.newPhotoTopic,
        roomId,
        countdownTime: 3000,
        topic: 'random',
    };

    it('when NewPhotoTopicMessage is written, setTopicMessage should be called', async () => {
        const setTopicMessage = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = topicHandler({ setTopicMessage });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setTopicMessage).toHaveBeenCalledTimes(1);
    });
});

describe('useTopicHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const topicHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useTopicHandler(socket, topicHandler));

        expect(topicHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const topicHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useTopicHandler(socket, topicHandler));

        expect(topicHandler).toHaveBeenCalledTimes(0);
    });
});
