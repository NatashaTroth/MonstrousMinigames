import { PlayerFinishedMessage, playerFinishedTypeGuard } from '../../../domain/typeGuards/game1/playerFinished';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('playerFinished TypeGuard', () => {
    it('when type is playerFinished, it should return true', () => {
        const data: PlayerFinishedMessage = {
            type: MessageTypesGame1.playerFinished,
            rank: 1,
            userId: '1',
        };

        expect(playerFinishedTypeGuard(data)).toEqual(true);
    });
});
