import { MessageTypesGame1 } from '../../../utils/constants';
import { GameHasStartedMessage, startedTypeGuard } from './started';

describe('started TypeGuard', () => {
    it('when type is started, it should return true', () => {
        const data: GameHasStartedMessage = {
            type: MessageTypesGame1.started,
            countdownTime: 4000,
        };

        expect(startedTypeGuard(data)).toEqual(true);
    });
});
