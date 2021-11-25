import GameTwoPlayer from "../../../src/gameplay/gameTwo/GameTwoPlayer";


let player: GameTwoPlayer;
describe('GameTwoPlyer Tests', () => {
    beforeEach(() => {
        player = new GameTwoPlayer('X', 'John', 10, 10, 3, 1);
    });

    it('initial direction should be C', () => {
        expect(player.direction).toEqual('C');
    });
});