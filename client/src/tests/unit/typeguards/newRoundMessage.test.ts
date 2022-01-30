import { NewRoundMessage, newRoundTypeGuard } from '../../../domain/typeGuards/game3/newRound';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('newRound TypeGuard', () => {
    it('when type is newRound, it should return true', () => {
        const data: NewRoundMessage = {
            type: MessageTypesGame3.newRound,
            roomId: 'SDGS',
            roundIdx: 1,
        };

        expect(newRoundTypeGuard(data)).toEqual(true);
    });
});
