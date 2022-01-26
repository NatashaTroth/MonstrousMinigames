import { InitialGameStateInfoMessage } from '../../../domain/typeGuards/game2/initialGameStateInfo';
import { MessageTypesGame2 } from '../../../utils/constants';

describe('initialGameStateHandler Game2', () => {
    const message: InitialGameStateInfoMessage = {
        type: MessageTypesGame2.initialGameState,
        data: {
            gameState: 'Mock',
            playersState: [],
            sheep: [],
            lengthX: 100,
            lengthY: 100,
            brightness: 50,
            roomId: 'TEST',
        },
    };

    // it('when message type is initialGameState, initiateGame should be called', async () => {
    //     const socket = new FakeInMemorySocket();
    //     const initiateGame = jest.fn();

    //     const dependencies = {
    //         initiateGame,
    //         screenAdmin: true,
    //         sendStartGame: jest.fn(),
    //         gameRenderer: {
    //             destroyLoadingScreen: jest.fn(),
    //         },
    //         camera: { setBackgroundColor: jest.fn() },
    //     };

    //     const withDependencies = initialGameStateHandler(dependencies);

    //     withDependencies(socket);
    //     await socket.emit(message);

    //     expect(initiateGame).toHaveBeenCalledTimes(1);
    // });

    // it('when message type is initialGameState, and screen is amdin, sendStartGame should be called', async () => {
    //     const socket = new FakeInMemorySocket();
    //     const sendStartGame = jest.fn();

    //     const dependencies = {
    //         initiateGame: jest.fn(),
    //         screenAdmin: true,
    //         sendStartGame,
    //         gameRenderer: {
    //             destroyLoadingScreen: jest.fn(),
    //         },
    //         camera: { setBackgroundColor: jest.fn() },
    //     };

    //     const withDependencies = initialGameStateHandler(dependencies);

    //     withDependencies(socket);
    //     await socket.emit(message);

    //     expect(sendStartGame).toHaveBeenCalledTimes(1);
    //});
});
