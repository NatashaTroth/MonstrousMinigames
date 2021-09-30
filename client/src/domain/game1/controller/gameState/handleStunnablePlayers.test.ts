import { MessageTypesGame1 } from "../../../../utils/constants";
import { StunnablePlayersMessage } from "../../../typeGuards/game1/stunnablePlayers";
import { handleStunnablePlayers } from "./handleStunnablePlayers";

describe('handleStunnablePlayers function', () => {
    const mockData: StunnablePlayersMessage = {
        type: MessageTypesGame1.stunnablePlayers,
        roomId: 'ABCD',
        stunnablePlayers: ['1', '2'],
    };

    it('handed setStunnablePlayers should be called', () => {
        const setStunnablePlayers = jest.fn();

        handleStunnablePlayers({
            data: mockData,
            dependencies: { setStunnablePlayers },
        });

        expect(setStunnablePlayers).toHaveBeenLastCalledWith(mockData.stunnablePlayers);
    });
});
