import { StunnablePlayersMessage, stunnablePlayersTypeGuard } from '../../domain/typeGuards/game1/stunnablePlayers';
import { MessageTypesGame1 } from '../../utils/constants';

describe('stunnablePlayers TypeGuard', () => {
    it('when type is stunnablePlayers, it should return true', () => {
        const data: StunnablePlayersMessage = {
            type: MessageTypesGame1.stunnablePlayers,
            roomId: 'ABCD',
            stunnablePlayers: ['1', '2'],
        };

        expect(stunnablePlayersTypeGuard(data)).toEqual(true);
    });
});
