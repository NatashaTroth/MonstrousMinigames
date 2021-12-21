import { initSockets } from '../../../domain/game1/screen/gameState/initSockets';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { InitialGameStateInfoMessage } from '../../../domain/typeGuards/game1/initialGameStateInfo';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('initSockets', () => {
    const roomId = 'SKES';
    const socket = new InMemorySocketFake();
    const scene = {
        camera: { setBackgroundColor: jest.fn() },
        gameRenderer: { destroyLoadingScreen: jest.fn() },
        initiateGame: jest.fn(),
        updateGameState: jest.fn(),
        createGameCountdown: jest.fn(),
        players: [
            {
                player: {
                    id: '1',
                },
                renderer: {
                    renderWind: jest.fn(),
                },
                handleApproachingObstacle: jest.fn(),
                handleObstacleSkipped: jest.fn(),
                destroyWarningIcon: jest.fn(),
                handleReset: jest.fn(),
                startRunning: jest.fn(),
                stopRunning: jest.fn(),
            },
        ],
        gameAudio: { stopMusic: jest.fn(), pause: jest.fn(), resume: jest.fn() },
        scene: {
            restart: jest.fn(),
            get: jest.fn(),
            pause: jest.fn(),
            resume: jest.fn(),
        },
        paused: false,
    };

    it('when InitialGameStateInfoMessage is emitted, initiateGame should be called', async () => {
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
        const initiateGame = jest.fn();

        initSockets({ socket, screenAdmin: true, scene: { ...scene, initiateGame }, roomId });

        await socket.emit(message);

        expect(initiateGame).toBeCalledTimes(1);
    });
});
