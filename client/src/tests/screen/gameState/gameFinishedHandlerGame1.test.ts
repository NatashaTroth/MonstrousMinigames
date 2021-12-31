import { createMemoryHistory } from 'history';

import { gameFinishedHandler } from '../../../domain/game1/screen/gameState/gameFinishedHandler';
import { PhaserGame } from '../../../domain/phaser/PhaserGame';
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
        const stopScene = jest.fn();
        const scene = {
            gameAudio: {
                stopMusic,
            },
            scene: {
                stop: stopScene,
            },
        };

        const withDependencies = gameFinishedHandler({ history, scene, currentScene: PhaserGame.SCENE_NAME_GAME_1 });

        withDependencies(socket);
        await socket.emit(message);

        expect(stopMusic).toHaveBeenCalledTimes(1);
    });
});
