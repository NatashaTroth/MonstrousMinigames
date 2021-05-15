import { MessageTypes } from '../../utils/constants';
import { GameHasStoppedMessage, stoppedTypeGuard } from './stopped';

describe('stopped TypeGuard', () => {
    it('when type is gameHasStopped, it should return true', () => {
        const data: GameHasStoppedMessage = {
            type: MessageTypes.gameHasStopped,
        };

        expect(stoppedTypeGuard(data)).toEqual(true);
    });
});
