import { createMemoryHistory } from 'history';

import { gameFinishedHandler } from '../../../domain/game1/screen/gameState/gameFinishedHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasFinishedMessage } from '../../../domain/typeGuards/finished';
import { GameState, MessageTypes } from '../../../utils/constants';

describe('gameFinishedHandler Game1', () => {
    const message: GameHasFinishedMessage = {
        type: MessageTypes.gameHasFinished,
        data: {
            gameState: GameState.stopped,
            numberOfObstacles: 2,
            roomId: 'AKES',
            trackLength: 500,
            playersState: [],
            playerRanks: [],
        },
    };

    it('when message type is gameHasFinished, stopMusic should be called', async () => {
        const socket = new FakeInMemorySocket();
        const history = createMemoryHistory();
        const stopMusic = jest.fn();
        const scene = {
            gameAudio: {
                stopMusic,
            },
        };

        const withDependencies = gameFinishedHandler({ history, scene });

        withDependencies(socket);
        await socket.emit(message);

        expect(stopMusic).toHaveBeenCalledTimes(1);
    });
});
