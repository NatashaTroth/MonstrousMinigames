import { InMemorySocketFake } from '../socket/InMemorySocketFake';
import { sendMovementToController } from './addMovementListener';

describe('test sendMovementToController function', () => {
    it('sendMovementToController should call handed sendMovement function', async () => {
        const e = {
            preventDefault: jest.fn(),
            acceleration: {
                x: 5,
            },
        };
        const playerFinished = false;
        const hasPaused = false;
        const controllerSocket = new InMemorySocketFake();
        const sendMovement = jest.fn();

        sendMovementToController(e, playerFinished, controllerSocket, hasPaused, sendMovement);
        expect(sendMovement).toHaveBeenCalledTimes(1);
    });
});
