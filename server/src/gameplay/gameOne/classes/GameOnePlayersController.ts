import * as HelperFunctions from '../../helperFunctions/verifyUserId';
import { HashTable } from '../../interfaces';
import Player from '../../Player';
import GameOne from '../GameOne';
import GameOnePlayer from '../GameOnePlayer';
import { getStonesForObstacles, sortBy } from '../helperFunctions/initiatePlayerState';
import { Obstacle, PlayerRank, PlayerStateForClient } from '../interfaces';

class GameOnePlayersController {
    private players: Map<string, GameOnePlayer>;
    constructor(
        players: Map<string, GameOnePlayer>,
        trackLength: number,
        initialPlayerPositionX: number,
        numberOfStones: number
    ) {
        this.players = new Map(players);
        const playersArray = Array.from(players.values());
        const obstacles: Obstacle[] = [];
        playersArray.forEach(player => obstacles.push(...player.obstacles));
        const stones =
            this.players.size > 1
                ? getStonesForObstacles(obstacles, trackLength, initialPlayerPositionX, 100, numberOfStones)
                : [];

        for (const player of playersArray) {
            player.obstacles = sortBy([...player.obstacles, ...stones.map(stone => ({ ...stone }))], 'positionX');
        }
    }

    getPlayerById(id: string) {
        return this.players.get(id)!;
    }

    getPlayerValues() {
        return this.players.values();
    }

    getActiveUnfinishedPlayers() {
        const players = Array.from(this.players.values());
        return players.filter(player => player.isActive && !player.finished);
    }

    getObstaclePositions(): HashTable<Array<Obstacle>> {
        const obstaclePositions: HashTable<Array<Obstacle>> = {};
        for (const player of this.players.values()) {
            obstaclePositions[player.id] = [...player.obstacles];
        }

        return obstaclePositions;
    }

    getPlayerState(): Array<PlayerStateForClient> {
        return Array.from(this.players.values()).map(player => ({
            //TODO renive
            id: player.id,
            name: player.name,
            positionX: player.positionX,
            obstacles: player.obstacles,
            atObstacle: player.atObstacle,
            finished: player.finished,
            finishedTimeMs: player.finishedTimeMs,
            dead: player.dead,
            rank: player.rank,
            isActive: player.isActive,
            stunned: player.stunned,
            characterNumber: player.characterNumber,
            chaserPushesUsed: player.chaserPushesUsed,
        }));
    }

    getCaughtPlayers(chasersPositionX: number) {
        return Array.from(this.players.values()).filter(
            player => !player.finished && player.positionX <= chasersPositionX
        );
    }

    getStunnablePlayers(): string[] {
        return Array.from(this.players.values()).reduce((res: string[], option: Player) => {
            if (!option.finished && option.isActive) {
                res.push(option.id);
            }
            return res;
        }, []);
    }

    createPlayerRanks(
        currentRank: number,
        gameStartedAt: number,
        rankSuccessfulUser: (rankingMetric: number) => number,
        rankFailedUser: (rankingMetric: number) => number,
        gameOneArg: GameOne,
        currentTime: number
    ): Array<PlayerRank> {
        this.rankUnrankedPlayers(rankSuccessfulUser, rankFailedUser, gameOneArg, currentTime);
        return Array.from(this.players.values()).map(player => {
            return {
                id: player.id,
                name: player.name,
                rank: player.rank,
                finished: player.finished,
                dead: player.dead,
                totalTimeInMs: (player.finishedTimeMs > 0 ? player.finishedTimeMs : Date.now()) - gameStartedAt,
                positionX: player.positionX,
                isActive: player.isActive,
            };
        });
    }

    verifyUserId(id: string) {
        HelperFunctions.verifyUserId(this.players, id);
    }

    private rankUnrankedPlayers(
        rankSuccessfulUser: (rankingMetric: number) => number,
        rankFailedUser: (rankingMetric: number) => number,
        gameOneArg: GameOne,
        currentTime: number
    ) {
        this.players.forEach(player => {
            if (!player.isActive && !player.finished) {
                player.handlePlayerCaught(currentTime);
                player.rank = rankFailedUser.call(gameOneArg, player.finishedTimeMs);
            } else if (!player.finished) {
                player.handlePlayerFinishedGame(
                    currentTime,
                    rankSuccessfulUser.call(gameOneArg, player.finishedTimeMs)
                );
                player.finished = true;
            }
        });
    }
}

export default GameOnePlayersController;
