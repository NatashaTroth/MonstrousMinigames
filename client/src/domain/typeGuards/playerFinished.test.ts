import { MessageTypes } from '../../utils/constants';
import { PlayerFinishedMessage, playerFinishedTypeGuard } from './playerFinished';

describe('playerFinished TypeGuard', () => {
    it('when type is playerFinished, it should return true', () => {
        const data: PlayerFinishedMessage = {
            type: MessageTypes.playerFinished,
            rank: 1,
        };

        expect(playerFinishedTypeGuard(data)).toEqual(true);
    });
});
