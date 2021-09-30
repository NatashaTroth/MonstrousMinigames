import { MessageTypesGame1 } from "../../../utils/constants";
import { playerStunnedTypeGuard } from "./playerStunned";
import { StunnablePlayersMessage } from "./stunnablePlayers";

describe('stunnablePlayers TypeGuard', () => {
    it('when type is stunnablePlayers, it should return true', () => {
        const data: StunnablePlayersMessage = {
            type: MessageTypesGame1.stunnablePlayers,
            roomId: 'ABCD',
            stunnablePlayers: ['1', '2'],
        };

        expect(playerStunnedTypeGuard(data)).toEqual(true);
    });
});
