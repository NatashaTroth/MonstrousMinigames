import { leaderboard, roomId, users } from '../../mockData';
import { MockGameClass } from '../../mockGameClass';

let game: MockGameClass;

const mockRankingMetric = 100;

describe('Rank failed user', () => {
    beforeEach(() => {
        game = new MockGameClass(roomId, leaderboard);
        game.createNewGame(users);
        game.startGame();
        jest.useFakeTimers();
    });

    afterAll(async () => {
        jest.clearAllTimers();
    });

    it('should reduce current back rank by 1', async () => {
        const initialCurrentBackRank = game['_currentBackRank'];
        game['rankFailedUser'](mockRankingMetric);
        expect(game['_currentBackRank']).toBe(initialCurrentBackRank - 1);
    });

    it('should return current back rank', async () => {
        const initialCurrentBackRank = game['_currentBackRank'];
        expect(game['rankFailedUser'](mockRankingMetric)).toBe(initialCurrentBackRank);
    });

    it('should return current back rank', async () => {
        const initialCurrentBackRank = game['_currentBackRank'];
        expect(game['rankFailedUser'](mockRankingMetric)).toBe(initialCurrentBackRank);
    });

    it('should rank the player before the player with the higher rankingMetric (e.g. ms)', async () => {
        const initialCurrentBackRank = game['_currentBackRank'];
        game['_backRankDictionary'].set(mockRankingMetric + 100, initialCurrentBackRank);
        const newCurrentBackRank = --game['_currentBackRank'];
        expect(game['rankFailedUser'](mockRankingMetric)).toBe(newCurrentBackRank);
    });

    it('should rank the player the same as the player with the same rankingMetric with the lower rank', async () => {
        game['rankFailedUser'](mockRankingMetric);
        const newCurrentBackRank = game['_currentBackRank'];
        expect(game['rankFailedUser'](mockRankingMetric)).toBe(newCurrentBackRank);
    });

    it('should change the previous players rank with the same rankingMetric with the new updated rank', async () => {
        const firstRank = game['rankFailedUser'](mockRankingMetric);
        game.players.get(users[0].id)!.rank = firstRank;
        const newRank = game['rankFailedUser'](mockRankingMetric);

        expect(game.players.get(users[0].id)!.rank).toBe(newRank);
    });
});
