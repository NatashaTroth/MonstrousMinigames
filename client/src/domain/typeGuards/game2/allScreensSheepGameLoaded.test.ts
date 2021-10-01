import { MessageTypesGame2 } from '../../../utils/constants';
import { AllScreensSheepGameLoadedMessage, allScreensSheepGameLoadedTypeGuard } from './allScreensSheepGameLoaded';

describe('allScreensPhaserGameLoaded TypeGuard', () => {
    it('when type is started, it should return true', () => {
        const data: AllScreensSheepGameLoadedMessage = {
            type: MessageTypesGame2.allScreensSheepGameLoaded,
        };

        expect(allScreensSheepGameLoadedTypeGuard(data)).toEqual(true);
    });
});
