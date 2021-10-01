import { MessageTypes } from '../../../utils/constants';
import { SheepGameHasStartedMessage, sheepGameStartedTypeGuard } from './started';

describe('started TypeGuard', () => {
    it('when type is started, it should return true', () => {
        const data: SheepGameHasStartedMessage = {
            type: MessageTypes.gameHasStarted,
            countdownTime: 4000,
        };

        expect(sheepGameStartedTypeGuard(data)).toEqual(true);
    });
});
