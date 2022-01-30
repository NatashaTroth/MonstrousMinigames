import { ChooseResponseMessage, chooseResponseTypeGuard } from '../../../domain/typeGuards/game2/chooseResponse';
import { MessageTypesGame2 } from '../../../utils/constants';

describe('chooseResponse', () => {
    it('when type is chooseResponse, it should return true', () => {
        const data: ChooseResponseMessage = {
            type: MessageTypesGame2.chooseResponse,
            roomId: 'TEST',
            successful: true,
        };

        expect(chooseResponseTypeGuard(data)).toEqual(true);
    });
});
