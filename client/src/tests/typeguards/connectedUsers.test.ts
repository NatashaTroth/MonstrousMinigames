import {
    ConnectedUsersMessage, connectedUsersTypeGuard
} from "../../domain/typeGuards/connectedUsers";
import { MessageTypes } from "../../utils/constants";

describe('finished TypeGuard', () => {
    it('when type is gameHasFinished, it should return true', () => {
        const data: ConnectedUsersMessage = {
            type: MessageTypes.connectedUsers,
        };

        expect(connectedUsersTypeGuard(data)).toEqual(true);
    });
});
