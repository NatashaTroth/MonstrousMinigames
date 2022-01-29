import { generateRandomArray, solveObstacle } from '../../../domain/game1/controller/components/obstacles/Trash';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypesGame1, ObstacleTypes, TrashType } from '../../../utils/constants';

describe('trash generateRandomArray', () => {
    it('must include as many obstacle types as given', () => {
        const trashType = TrashType.Paper;
        const numberTrashItems = 3;
        const randomArray = generateRandomArray({
            id: 1,
            type: ObstacleTypes.trash,
            trashType,
            numberTrashItems,
        });

        expect(randomArray.filter(item => item === trashType).length).toBe(numberTrashItems);
    });
});

describe('trash solveObstacle', () => {
    it('obstacleSolved should be emitted to socket', () => {
        const controllerSocket = new FakeInMemorySocket();
        const obstacle = { id: 1, type: ObstacleTypes.trash };

        solveObstacle({
            controllerSocket,
            obstacle,
            setObstacle: jest.fn(),
            clearTimeout: jest.fn(),
            handleSkip: setTimeout(() => {
                // do nothing
            }, 1000),
            roomId: 'ABCD',
        });

        expect(controllerSocket.emitedVals).toStrictEqual([
            {
                type: MessageTypesGame1.obstacleSolved,
                obstacleId: obstacle.id,
            },
        ]);
    });
});
