import { gameStateInfoHandler } from '../../../domain/game1/screen/gameState/gameStateInfoHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameStateInfoMessage } from '../../../domain/typeGuards/game1/gameStateInfo';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('gameStateInfoHandler Game1', () => {
    const message: GameStateInfoMessage = {
        type: MessageTypesGame1.gameState,
        data: {
            gameState: 'Mock',
            numberOfObstacles: 2,
            playersState: [],
            roomId: 'AFAE',
            trackLength: 5000,
            chasersPositionX: 10,
            cameraPositionX: 10,
        },
    };

    it('when message type is gameState, updateGameState should be called', async () => {
        const socket = new FakeInMemorySocket();
        const updateGameState = jest.fn();

        const withDependencies = gameStateInfoHandler({ updateGameState });

        withDependencies(socket);
        await socket.emit(message);

        expect(updateGameState).toHaveBeenCalledTimes(1);
    });
});
