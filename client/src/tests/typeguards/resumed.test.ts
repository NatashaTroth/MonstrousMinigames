import { MessageTypes } from '../../utils/constants';
import { GameHasResumedMessage, resumedTypeGuard } from './resumed';

describe('resumed TypeGuard', () => {
    it('when type is resumed, it should return true', () => {
        const data: GameHasResumedMessage = {
            type: MessageTypes.gameHasResumed,
        };

        expect(resumedTypeGuard(data)).toEqual(true);
    });
});
