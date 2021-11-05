import { MessageTypesGame1 } from "../../../../utils/constants";
import { InMemorySocketFake } from "../../../socket/InMemorySocketFake";
import handleStartGame1 from "./handleStartGame1";

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('handleStartGame1', () => {
    it('startPhaserGame should be emitted to socket', () => {
        const screenSocket = new InMemorySocketFake();
        const roomId = 'ABCD';
        const userId = '1';

        global.sessionStorage.setItem('roomId', roomId);
        global.sessionStorage.setItem('userId', userId);

        handleStartGame1(screenSocket);

        expect(screenSocket.emitedVals).toStrictEqual([
            {
                type: MessageTypesGame1.startPhaserGame,
                roomId,
                userId,
            },
        ]);
    });
});
