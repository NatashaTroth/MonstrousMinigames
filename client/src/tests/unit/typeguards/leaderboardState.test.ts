import { LeaderboardStateMessage, leaderboardStateTypeGuard } from '../../../domain/typeGuards/leaderboardState';
import { MessageTypes } from '../../../utils/constants';

describe('finished TypeGuard', () => {
    it('when type is leaderboardState, it should return true', () => {
        const data: LeaderboardStateMessage = {
            type: MessageTypes.leaderboardState,
            leaderboardState: {
                gameHistory: [],
                userPoints: [],
            },
        };

        expect(leaderboardStateTypeGuard(data)).toEqual(true);
    });
});
