import { MessageTypes } from '../../utils/constants';
import { GameNames } from '../../utils/games';
import { GameSetMessage, gameSetTypeGuard } from './gameSet';

describe('game set TypeGuard', () => {
    it('when game is set it should return true', () => {
        const data: GameSetMessage = {
            type: MessageTypes.gameSet,
            game: GameNames.game1,
        };

        expect(gameSetTypeGuard(data)).toEqual(true);
    });
});
