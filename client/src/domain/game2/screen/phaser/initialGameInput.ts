import { SheepState } from './Sheep';

export const initialGameInput = {
    roomId: 'ZVSH',
    playersState: [
        {
            id: '2r9HDAldY',
            name: 'Max Mustermann',
            positionX: 100,
            positionY: 100,
            finished: false,
            isActive: true,
            characterNumber: 1,
        },
    ],
    sheep: [{ state: SheepState.ALIVE, id: 'sheep1', coordinates: { x: 100, y: 150 } }],
    lengthX: 250,
    lengthY: 200,
    gameState: 'CREATED',
};
