import GameTwoPlayer from "../../../src/gameplay/gameTwo/GameTwoPlayer";


let player: GameTwoPlayer;
describe('GameTwoPlyer Tests', () => {
    beforeEach(() => {
        player = new GameTwoPlayer('X', 'John', 10, 10, 3, 1);
    });

    it('should get the right guess for the given round number', () => {
        const guess = 10;
        player.addGuess(1, guess, 20);

        const guessForRound = player.getGuessForRound(1);
        expect(guessForRound).toEqual(guess);
    });
    it('should return false if there is no guess for the given round number', () => {
        const guessForRound = player.getGuessForRound(1);
        expect(guessForRound).toEqual(false);
    });
});