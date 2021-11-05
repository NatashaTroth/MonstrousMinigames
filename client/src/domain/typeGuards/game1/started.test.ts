import { GameNames } from '../../../config/games';
import { MessageTypes } from '../../../utils/constants';
import { GameHasStartedMessage, startedTypeGuard } from './started';

describe('started TypeGuard', () => {
    it('when type is started, it should return true', () => {
        const data: GameHasStartedMessage = {
            type: MessageTypes.gameHasStarted,
            game: GameNames.game1,
            countdownTime: 4000,
        };

        expect(startedTypeGuard(data)).toEqual(true);
    });
});
