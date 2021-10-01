import { MessageTypesGame3 } from "../../../utils/constants";
import { InitialGameStateMessage, initialGameStateTypeGuard } from "./initialGameState";

describe('intitialGameState TypeGuard', () => {
    it('when type is intitialGameState, it should return true', () => {
        const data: InitialGameStateMessage = {
            type: MessageTypesGame3.initialGameState,
        };

        expect(initialGameStateTypeGuard(data)).toEqual(true);
    });
});
