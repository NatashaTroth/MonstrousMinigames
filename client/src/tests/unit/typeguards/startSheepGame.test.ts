import { StartSheepGameMessage, startSheepGameTypeGuard } from '../../../domain/typeGuards/startSheepGame';
import { MessageTypesGame2 } from '../../../utils/constants';

describe('startSheepGame TypeGuard', () => {
    it('when type is startSheepGame, it should return true', () => {
        const data: StartSheepGameMessage = {
            type: MessageTypesGame2.startSheepGame,
            countdownTime: 3000,
        };

        expect(startSheepGameTypeGuard(data)).toEqual(true);
    });
});
