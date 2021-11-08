import {
    AllScreensPhaserGameLoadedMessage, allScreensPhaserGameLoadedTypeGuard
} from "../../domain/typeGuards/game1/allScreensPhaserGameLoaded";
import { MessageTypesGame1 } from "../../utils/constants";

describe('allScreensPhaserGameLoaded TypeGuard', () => {
    it('when type is started, it should return true', () => {
        const data: AllScreensPhaserGameLoadedMessage = {
            type: MessageTypesGame1.allScreensPhaserGameLoaded,
        };

        expect(allScreensPhaserGameLoadedTypeGuard(data)).toEqual(true);
    });
});
