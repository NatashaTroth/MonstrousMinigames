// export default { '1': 5, '2': 3, '3': 2, '4': 1 };

export default class RankPoints {
    private static rankPointsDictionary = new Map<number, number>([
        [1, 5],
        [2, 3],
        [3, 2],
        [4, 1],
    ]);

    static getPointsFromRank(rank: number): number {
        return RankPoints.rankPointsDictionary.get(rank) || 0;
    }
}
