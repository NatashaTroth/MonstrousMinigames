import { GameHasStoppedMessage, stoppedTypeGuard } from '../../../domain/typeGuards/stopped';
import { MessageTypes } from '../../../utils/constants';

describe('stopped TypeGuard', () => {
    it('when type is gameHasStopped, it should return true', () => {
        const data: GameHasStoppedMessage = {
            type: MessageTypes.gameHasStopped,
        };

        expect(stoppedTypeGuard(data)).toEqual(true);
    });
});
