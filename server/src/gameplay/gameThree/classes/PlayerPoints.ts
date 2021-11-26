import { PlayerNameId } from '../interfaces';

export class PlayerPoints {
    private points: Map<string, number>; //<userId, points>

    constructor(players: PlayerNameId[]) {
        this.points = this.createPointsMap(players);
    }

    private createPointsMap(players: PlayerNameId[]): Map<string, number> {
        const pointsMap = new Map<string, number>();
        players.forEach(player => {
            pointsMap.set(player.id, 0);
        });
        return pointsMap;
    }

    addPointsToPlayer(playerId: string, points: number) {
        const currentPoints = this.points.get(playerId);
        if (currentPoints != undefined) {
            this.points.set(playerId, currentPoints + points);
        }
    }

    addPointsToMultiplePlayers(playerPoints: Map<string, number> | undefined) {
        if (!playerPoints) return;
        this.points.forEach((currentPoints, playerId) => {
            if (playerPoints.has(playerId))
                this.points.set(playerId, this.points.get(playerId)! + playerPoints.get(playerId)!);
        });
        return this.points;
    }

    getPointsFromPlayer(playerId: string) {
        const currentPoints = this.points.get(playerId);
        return currentPoints || 0;
    }

    getAllPlayerPoints(): Map<string, number> {
        return new Map(this.points);
    }
}
