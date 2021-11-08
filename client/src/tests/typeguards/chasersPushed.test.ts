import { MessageTypesGame1 } from '../../../utils/constants';
import { ChasersPushedMessage, ChasersPushedTypeGuard } from './chasersPushed';

describe('chasersPushed TypeGuard', () => {
    it('when type is chasersPushed, it should return true', () => {
        const data: ChasersPushedMessage = {
            type: MessageTypesGame1.chasersPushed,
        };

        expect(ChasersPushedTypeGuard(data)).toEqual(true);
    });
});
