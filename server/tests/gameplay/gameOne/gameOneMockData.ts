import InitialParameters from '../../../src/gameplay/gameOne/constants/InitialParameters';
import { GameOneMsgType, ObstacleType } from '../../../src/gameplay/gameOne/enums';
import GameOnePlayer from '../../../src/gameplay/gameOne/GameOnePlayer';
import { Obstacle } from '../../../src/gameplay/gameOne/interfaces';
import { IMessage } from '../../../src/interfaces/messages';
import { roomId, trackLength, users } from '../mockData';

export const pushChasersMessage: IMessage = {
    type: GameOneMsgType.CHASERS_WERE_PUSHED,
    userId: users[0].id,
};

export const runForwardMessage: IMessage = {
    type: GameOneMsgType.MOVE,
    userId: users[0].id,
};

export const playerHasCompletedObstacleMessage: IMessage = {
    type: GameOneMsgType.OBSTACLE_SOLVED,
    userId: users[0].id,
};

export const obstacles: Obstacle[] = [
    { id: 17, positionX: 1675, type: ObstacleType.Stone, solvable: true },
    { id: 0, positionX: 1940, type: ObstacleType.TreeStump, solvable: false },
    { id: 18, positionX: 2285, type: ObstacleType.Stone, solvable: true },
    { id: 1, positionX: 2600, type: ObstacleType.Spider, solvable: false },
    { id: 19, positionX: 3261, type: ObstacleType.Stone, solvable: true },
    { id: 2, positionX: 3690, type: ObstacleType.TreeStump, solvable: false },
    { id: 20, positionX: 3935, type: ObstacleType.Stone, solvable: true },
    { id: 3, positionX: 4340, type: ObstacleType.TreeStump, solvable: false },
];

export const players = new Map<string, GameOnePlayer>();
for (const user of users) {
    players.set(
        user.id,
        new GameOnePlayer(
            user.id,
            user.name,
            InitialParameters.PLAYERS_POSITION_X,
            obstacles,
            user.characterNumber,
            trackLength,
            roomId
        )
    );
}
