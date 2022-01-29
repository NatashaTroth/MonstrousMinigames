import {
    ObstacleWillBeSolvedMessage,
    obstacleWillBeSolvedTypeGuard,
} from '../../../domain/typeGuards/game1/obstacleWillBeSolved';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('obstacle will be solved TypeGuard', () => {
    it('when type is obstacle, it should return true', () => {
        const data: ObstacleWillBeSolvedMessage = {
            type: MessageTypesGame1.obstacleWillBeSolved,
            obstacleId: 1,
            userId: 'xxx',
        };

        expect(obstacleWillBeSolvedTypeGuard(data)).toEqual(true);
    });
});
