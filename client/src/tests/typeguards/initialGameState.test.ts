import {
    InitialGameStateMessage, initialGameStateTypeGuard
} from "../../domain/typeGuards/game3/initialGameState";
import { MessageTypesGame3 } from "../../utils/constants";

describe('intitialGameState TypeGuard', () => {
    it('when type is intitialGameState, it should return true', () => {
        const data: InitialGameStateMessage = {
            type: MessageTypesGame3.initialGameState,
        };

        expect(initialGameStateTypeGuard(data)).toEqual(true);
    });
});
