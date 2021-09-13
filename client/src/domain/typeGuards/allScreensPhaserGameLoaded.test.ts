import { MessageTypes } from '../../utils/constants';
import { AllScreensPhaserGameLoadedMessage, allScreensPhaserGameLoadedTypeGuard } from './allScreensPhaserGameLoaded';

describe('allScreensPhaserGameLoaded TypeGuard', () => {
    it('when type is started, it should return true', () => {
        const data: AllScreensPhaserGameLoadedMessage = {
            type: MessageTypes.allScreensPhaserGameLoaded,
        };

        expect(allScreensPhaserGameLoadedTypeGuard(data)).toEqual(true);
    });
});
