import { PlayerRanksMessage, playerRanksTypeGuard } from '../../domain/typeGuards/game2/playerRanks';
import { MessageTypesGame2 } from '../../utils/constants';

describe('playerRank TypeGuard', () => {
    it('when type is playersRank, it should return true', () => {
        const data: PlayerRanksMessage = {
            type: MessageTypesGame2.playerRanks,
            roomId: 'ABES',
            playerRanks: [],
        };

        expect(playerRanksTypeGuard(data)).toEqual(true);
    });
});
