import { GameNames } from "../../../config/games";
import { gameSetHandler } from "../../../domain/commonGameState/gameSetHandler";
import { InMemorySocketFake } from "../../../domain/socket/InMemorySocketFake";
import { GameSetMessage } from "../../../domain/typeGuards/gameSet";
import { MessageTypes } from "../../../utils/constants";

describe('gameSetHandler', () => {
    const game = GameNames.game1;
    const mockData: GameSetMessage = {
        type: MessageTypes.gameSet,
        game,
    };

    it('when GameSetMessage is emitted, handed setChosenGame should be called with emitted game', async () => {
        const setChosenGame = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = gameSetHandler({ setChosenGame });
        withDependencies(socket);

        await socket.emit(mockData);

        expect(setChosenGame).toHaveBeenCalledWith(game);
    });
});
