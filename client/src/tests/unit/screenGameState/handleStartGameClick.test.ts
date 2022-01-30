import { games } from '../../../config/games';
import { handleStartGameClick } from '../../../domain/commonGameState/screen/handleStartGameClick';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypes } from '../../../utils/constants';

describe('handleStartGameClick', () => {
    const roomId = 'WEAF';
    const selectedGame = games[0];
    const difficulty = 1;

    it('should emit selected game to socket if screen is admin', () => {
        const socket = new FakeInMemorySocket();
        const setChosenGame = jest.fn();
        const screenAdmin = true;

        handleStartGameClick(setChosenGame, selectedGame, roomId, screenAdmin, socket, difficulty);

        expect(socket.emitedVals).toEqual([
            {
                type: MessageTypes.chooseGame,
                game: selectedGame.id,
                difficulty,
            },
        ]);
    });

    it('should not emit selected game to socket if screen is not admin', () => {
        const socket = new FakeInMemorySocket();
        const setChosenGame = jest.fn();
        const screenAdmin = false;

        handleStartGameClick(setChosenGame, selectedGame, roomId, screenAdmin, socket, difficulty);

        expect(socket.emitedVals).toEqual([]);
    });
});
