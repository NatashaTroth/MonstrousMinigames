import { GameHasResumedMessage, resumedTypeGuard } from '../../../domain/typeGuards/resumed';
import { MessageTypes } from '../../../utils/constants';

describe('resumed TypeGuard', () => {
    it('when type is resumed, it should return true', () => {
        const data: GameHasResumedMessage = {
            type: MessageTypes.gameHasResumed,
        };

        expect(resumedTypeGuard(data)).toEqual(true);
    });
});
