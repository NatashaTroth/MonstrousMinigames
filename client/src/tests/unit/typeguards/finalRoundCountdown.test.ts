import {
    FinalRoundCountdownMessage,
    finalRoundCountdownTypeGuard,
} from '../../../domain/typeGuards/game3/finalRoundCountdown';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('finalRoundCountdown TypeGuard', () => {
    it('when type is finalRoundCountdown, it should return true', () => {
        const data: FinalRoundCountdownMessage = {
            type: MessageTypesGame3.finalRoundCountdown,
            roomId: 'ADGS',
            countdownTime: 3000,
            photoTopics: [],
        };

        expect(finalRoundCountdownTypeGuard(data)).toEqual(true);
    });
});
