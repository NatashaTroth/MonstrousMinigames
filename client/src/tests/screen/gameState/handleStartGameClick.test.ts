import { games } from '../../../config/games';
import { handleStartGameClick } from '../../../domain/commonGameState/screen/handleStartGameClick';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypes } from '../../../utils/constants';

describe('handleStartGameClick', () => {
    const roomId = 'WEAF';
    const selectedGame = games[0];

    it('should emit selected game to socket if screen is admin', () => {
        const socket = new InMemorySocketFake();
        const setChosenGame = jest.fn();
        const screenAdmin = true;

        handleStartGameClick(setChosenGame, selectedGame, roomId, screenAdmin, socket);

        expect(socket.emitedVals).toEqual([
            {
                type: MessageTypes.chooseGame,
                game: selectedGame.id,
            },
        ]);
    });

    it('should not emit selected game to socket if screen is not admin', () => {
        const socket = new InMemorySocketFake();
        const setChosenGame = jest.fn();
        const screenAdmin = false;

        handleStartGameClick(setChosenGame, selectedGame, roomId, screenAdmin, socket);

        expect(socket.emitedVals).toEqual([]);
    });
});
