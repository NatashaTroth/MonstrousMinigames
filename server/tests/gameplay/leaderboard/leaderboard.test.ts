// import { CatchFoodGame } from '../../../src/gameplay';
import Leaderboard from '../../../src/gameplay/leaderboard/Leaderboard';

// import { users } from '../mockUsers';

// let catchFoodGame: CatchFoodGame;
let leaderboard: Leaderboard;
const ROOM_ID = '###';

describe('Create new Leaderboard', () => {
    beforeEach(() => {
        leaderboard = new Leaderboard(ROOM_ID);
    });

    // it('Initates class', async () => {
    //     // expect(Object.keys(catchFoodGame.playersState).length).toBe(users.length);
    //     jest.mock('../../../src/gameplay/leaderboard/Leaderboard');
    //     const leaderboard = new Leaderboard(ROOM_ID);
    //     expect(Leaderboard).toHaveBeenCalledTimes(1);
    //     // Leaderboard.mockClear();
    // });

    it('Initiates the roomId', async () => {
        expect(leaderboard.roomId).toBe(ROOM_ID);
    });

    it('Initiates gameHistory', async () => {
        expect(leaderboard.gameHistory).toMatchObject([]);
    });

    it('Initiates userPoints', async () => {
        expect(leaderboard.userPoints).toMatchObject({});
    });
});
