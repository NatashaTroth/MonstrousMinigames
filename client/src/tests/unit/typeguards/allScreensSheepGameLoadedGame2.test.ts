import {
    AllScreensSheepGameLoadedMessage,
    allScreensSheepGameLoadedTypeGuard,
} from '../../../domain/typeGuards/game2/allScreensSheepGameLoaded';
import { MessageTypesGame2 } from '../../../utils/constants';

describe('allScreensPhaserGameLoaded TypeGuard', () => {
    it('when type is started, it should return true', () => {
        const data: AllScreensSheepGameLoadedMessage = {
            type: MessageTypesGame2.allScreensSheepGameLoaded,
        };

        expect(allScreensSheepGameLoadedTypeGuard(data)).toEqual(true);
    });
});
