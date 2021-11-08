import { GameState } from '../../../../src/gameplay/enums';
import { leaderboard, mockMessage, roomId } from '../../mockData';
import { MockGameClass } from '../../mockGameClass';

let game: MockGameClass;

describe('Receive Input', () => {
    beforeEach(() => {
        game = new MockGameClass(roomId, leaderboard);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return if the game state is not started', async () => {
        const handleInputSpy = jest.spyOn(MockGameClass.prototype as any, 'handleInput');
        game.receiveInput(mockMessage);
        expect(handleInputSpy).not.toHaveBeenCalled();
    });

    it('should call handleInput', async () => {
        game.gameState = GameState.Started;
        const handleInputSpy = jest.spyOn(MockGameClass.prototype as any, 'handleInput');
        game.receiveInput(mockMessage);
        expect(handleInputSpy).toHaveBeenCalled();
    });

    it('should call handleInput with message', async () => {
        game.gameState = GameState.Started;
        const handleInputSpy = jest.spyOn(MockGameClass.prototype as any, 'handleInput');
        game.receiveInput(mockMessage);
        expect(handleInputSpy).toHaveBeenCalledWith(mockMessage);
    });
});
