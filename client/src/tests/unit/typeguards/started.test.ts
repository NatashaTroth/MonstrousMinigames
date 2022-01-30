import { GameNames } from '../../../config/games';
import { GameHasStartedMessage, startedTypeGuard } from '../../../domain/typeGuards/game1/started';
import { MessageTypes } from '../../../utils/constants';

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
