import { ChasersPushedMessage, ChasersPushedTypeGuard } from '../../domain/typeGuards/game1/chasersPushed';
import { MessageTypesGame1 } from '../../utils/constants';

describe('chasersPushed TypeGuard', () => {
    it('when type is chasersPushed, it should return true', () => {
        const data: ChasersPushedMessage = {
            type: MessageTypesGame1.chasersPushed,
        };

        expect(ChasersPushedTypeGuard(data)).toEqual(true);
    });
});
