import { initialGameStateHandler } from '../../../domain/game1/screen/gameState/initialGameStateHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { InitialGameStateInfoMessage } from '../../../domain/typeGuards/game1/initialGameStateInfo';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('initialGameStateHandler Game1', () => {
    const message: InitialGameStateInfoMessage = {
        type: MessageTypesGame1.initialGameState,
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

    it('when message type is initialGameState, initiateGame should be called', async () => {
        const socket = new FakeInMemorySocket();
        const initiateGame = jest.fn();

        const dependencies = {
            initiateGame,
            screenAdmin: false,
            sendStartGame: jest.fn(),
            gameRenderer: {
                destroyLoadingScreen: jest.fn(),
            },
            camera: { setBackgroundColor: jest.fn() },
        };

        const withDependencies = initialGameStateHandler(dependencies);

        withDependencies(socket);
        await socket.emit(message);

        expect(initiateGame).toHaveBeenCalledTimes(1);
    });

    it('when message type is initialGameState, and screen is amdin, sendStartGame should be called', async () => {
        const socket = new FakeInMemorySocket();
        const sendStartGame = jest.fn();

        const dependencies = {
            initiateGame: jest.fn(),
            screenAdmin: true,
            sendStartGame,
            gameRenderer: {
                destroyLoadingScreen: jest.fn(),
            },
            camera: { setBackgroundColor: jest.fn() },
        };

        const withDependencies = initialGameStateHandler(dependencies);

        withDependencies(socket);
        await socket.emit(message);

        expect(sendStartGame).toHaveBeenCalledTimes(1);
    });
});
