import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import {
    presentFinalPhotosHandler,
    usePresentFinalPhotosHandler,
} from '../../../domain/game3/screen/gameState/presentFinalPhotosHandler';
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
        const socket = new InMemorySocketFake();

        const withDependencies = presentFinalPhotosHandler({ setPresentFinalPhotos });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setPresentFinalPhotos).toHaveBeenCalledTimes(1);
    });
});

describe('usePresentFinalPhotosHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const presentFinalPhotosHandler = jest.fn();
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => usePresentFinalPhotosHandler(socket, presentFinalPhotosHandler));

        expect(presentFinalPhotosHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const presentFinalPhotosHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => usePresentFinalPhotosHandler(socket, presentFinalPhotosHandler));

        expect(presentFinalPhotosHandler).toHaveBeenCalledTimes(0);
    });
});
