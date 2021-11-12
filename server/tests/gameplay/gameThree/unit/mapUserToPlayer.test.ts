import 'reflect-metadata';

// import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import GameThreePlayer from '../../../../src/gameplay/gameThree/GameThreePlayer';
import { leaderboard, roomId, users } from '../../mockData';

let gameThree: GameThree;

let player: GameThreePlayer;

describe('Map User to Player', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        // gameThree.createNewGame(users[0]);
        player = gameThree['mapUserToPlayer'](users[0]);
    });

    it('should return player as instance of GameThreePlayer', async () => {
        expect(player).toBeInstanceOf(GameThreePlayer);
    });

    it('should return the correct user id', async () => {
        expect(player.id).toBe(users[0].id);
    });

    it('should return the correct name', async () => {
        expect(player.name).toBe(users[0].name);
    });

    it('should return the correct characterNumber', async () => {
        expect(player.characterNumber).toBe(users[0].characterNumber);
    });

    xit('should create a roundInfo array with the correct number of rounds', async () => {
        // expect(player.roundInfo.length).toBe(InitialParameters.NUMBER_ROUNDS - 1);
    });
});
