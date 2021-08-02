import { shuffleArray } from '../../../helpers/shuffleArray';
import { ObstacleType } from '../enums';
import { Obstacle } from '../interfaces';

export function getObstacleTypes(numberOfObstacles: number): Array<ObstacleType> {
    const obstacleTypeKeys: Array<string> = Object.keys(ObstacleType);
    const obstacleTypes: Array<ObstacleType> = [];
    for (let i = 0; i < numberOfObstacles; i++) {
        const randomNr = Math.floor(Math.random() * Math.floor(obstacleTypeKeys.length));
        obstacleTypes.push(obstacleTypeKeys[randomNr] as ObstacleType);
    }
    return obstacleTypes;
}

export function createObstacles(
    obstacleTypes: Array<ObstacleType>,
    numberOfObstacles: number,
    trackLength: number,
    initialPlayerPositionX: number
): Array<Obstacle> {
    const obstacles: Array<Obstacle> = [];
    const shuffledObstacleTypes: Array<ObstacleType> = shuffleArray(obstacleTypes);

    const quadrantRange = Math.floor((trackLength - initialPlayerPositionX) / (numberOfObstacles + 1)) - 100; //e.g. 500/4 = 125, +10 to avoid obstacle being at the very beginning, - 10 to stop 2 being right next to eachother

    for (let i = 0; i < numberOfObstacles; i++) {
        const randomNr = Math.random() * quadrantRange;

        let position = randomNr + quadrantRange * (i + 1);
        position = Math.round(position / 10) * 10; //round to nearest 10 (to stop exactly at it)
        obstacles.push({
            id: i,
            positionX: initialPlayerPositionX + position,
            type: shuffledObstacleTypes[i],
        });
    }
    return obstacles;
}
