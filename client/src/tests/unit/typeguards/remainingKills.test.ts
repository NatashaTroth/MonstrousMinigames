import { RemainingKillsMessage, remainingKillsTypeGuard } from '../../../domain/typeGuards/game2/remainingKills';
import { MessageTypesGame2 } from '../../../utils/constants';

describe('remainingKills TypeGuard', () => {
    it('when type is remainingKills, it should return true', () => {
        const data: RemainingKillsMessage = {
            type: MessageTypesGame2.remainingKills,
            remainingKills: 5,
        };

        expect(remainingKillsTypeGuard(data)).toEqual(true);
    });
});
