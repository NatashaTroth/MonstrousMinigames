import { MessageTypes } from "../../../../utils/constants";
import { InMemorySocketFake } from "../../../socket/InMemorySocketFake";
import handleStartClickedGame3 from "./handleStartClickedGame3";

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('handleStartClickedGame3 function', () => {
    it('createGame should be emitted first', () => {
        const socket = new InMemorySocketFake();
        const roomId = 'ABCD';

        global.sessionStorage.setItem('roomId', roomId);

        handleStartClickedGame3(socket);

        expect(socket.emitedVals[0]).toEqual({ type: MessageTypes.createGame, roomId });
    });

    it('startGame should be emitted second', () => {
        const socket = new InMemorySocketFake();
        const roomId = 'ABCD';

        global.sessionStorage.setItem('roomId', roomId);

        handleStartClickedGame3(socket);

        expect(socket.emitedVals[1]).toEqual({ type: MessageTypes.startGame, roomId });
    });
});
