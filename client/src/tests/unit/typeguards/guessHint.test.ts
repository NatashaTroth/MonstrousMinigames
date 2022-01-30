import { GuessHintMessage, guessHintTypeGuard } from '../../../domain/typeGuards/game2/guessHint';
import { MessageTypesGame2 } from '../../../utils/constants';

describe('guessHint TypeGuard', () => {
    it('when type is guessHint, it should return true', () => {
        const data: GuessHintMessage = {
            type: MessageTypesGame2.guessHint,
            roomId: 'ABES',
            userId: '1',
            hint: 'Hint',
        };

        expect(guessHintTypeGuard(data)).toEqual(true);
    });
});
