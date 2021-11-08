import { GameNames } from '../../config/games';
import { GameSetMessage, gameSetTypeGuard } from '../../domain/typeGuards/gameSet';
import { MessageTypes } from '../../utils/constants';

describe('game set TypeGuard', () => {
    it('when game is set it should return true', () => {
        const data: GameSetMessage = {
            type: MessageTypes.gameSet,
            game: GameNames.game1,
        };

        expect(gameSetTypeGuard(data)).toEqual(true);
    });
});
