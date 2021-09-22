import { shuffleArray } from '../../../helpers/shuffleArray';
import { ObstacleType } from '../enums';
import { regularObstactTypes } from '../enums/ObstacleType';
import { Obstacle } from '../interfaces';

function getObstaclesInRange(obstacles: Obstacle[], obstacleWidth: number, beginning: number, ending: number) {
    return obstacles.filter(
        obstacle =>
            obstacle.positionX > beginning - obstacleWidth / 2 && obstacle.positionX < ending + obstacleWidth / 2
    );
}
function getAvailableSlotsInRange(obstacles: Obstacle[], obstacleWidth: number, beginning: number, ending: number) {
    const obstaclesInRange = getObstaclesInRange(obstacles, obstacleWidth, beginning, ending).map(
        obstacle => obstacle.positionX
    );
    obstaclesInRange.sort();
    const freeRanges: Array<[number, number]> = [];
    let lastPosition = beginning;
    for (let i = 0; i < obstaclesInRange.length; i++) {
        freeRanges.push([lastPosition, obstaclesInRange[i] - obstacleWidth / 2]);
        lastPosition = obstaclesInRange[i] + obstacleWidth / 2;
    }
    freeRanges.push([lastPosition, ending]);
    const possibleRanges = freeRanges.filter(range => range[1] - range[0] >= obstacleWidth);
    const result: number[] = [];

    for (const range of possibleRanges) {
        const numberOfRanges = Math.floor((range[1] - range[0]) / obstacleWidth);
        const rangeWidth = (range[1] - range[0]) / numberOfRanges;

        for (let i = 0; i < numberOfRanges; i++) {
            result.push(Math.round(range[0] + rangeWidth * i + rangeWidth / 2));
        }
    }

    return result;
}

export function sortBy<T>(array: T[], by: keyof T) {
    return array.sort((a1: T, a2: T) => {
        if (a1[by] == a2[by]) {
            return 0;
        }
        if (a1[by] > a2[by]) {
            return 1;
        }

        return -1;
    });
}

export function getStonesForObstacles(
    obstacles: Obstacle[],
    trackLength: number,
    initialPlayerPositionX: number,
    obstacleWidth: number,
    count: number,
    minObstacleWidth?: number,
    noClone = false
): Obstacle[] {
    minObstacleWidth = minObstacleWidth || obstacleWidth / 2;
    const obstacleClone = noClone ? obstacles : [...obstacles];
    const splitLength = (trackLength - initialPlayerPositionX) / ((count + 1.5) * 1.1);
    const availableSplitLength = splitLength / 1.1;
    let id = obstacles.length + 1;
    let stonesAdded = 0;
    const stones: Obstacle[] = [];

    for (let i = 1; i <= count; i++) {
        const beginning = splitLength * i;
        const ending = beginning + availableSplitLength;
        const availablePositions = getAvailableSlotsInRange(obstacleClone, obstacleWidth, beginning, ending);

        if (availablePositions.length === 0) {
            continue;
        }

        const stone = {
            id: id++,
            positionX:
                initialPlayerPositionX + availablePositions[Math.floor(Math.random() * availablePositions.length)],
            type: ObstacleType.Stone,
            skippable: true,
        };

        obstacleClone.push(stone);
        stones.push(stone);
        stonesAdded++;
    }

    if (stonesAdded < count * 0.8 && obstacleWidth > minObstacleWidth) {
        const newStones = getStonesForObstacles(
            obstacleClone,
            trackLength,
            initialPlayerPositionX,
            obstacleWidth * 0.9,
            count - stonesAdded,
            minObstacleWidth,
            true
        );

        return sortBy([...stones, ...newStones], 'positionX');
    }

    return sortBy(stones, 'positionX');
}

export function getObstacleTypes(numberOfObstacles: number): Array<ObstacleType> {
    const obstacleTypeKeys: Array<string> = regularObstactTypes;
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
    if (trackLength - initialPlayerPositionX <= numberOfObstacles) {
        throw new Error('Track length is too short for the number of obstacles!');
    }

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
            skippable: false,
        });
    }

    return obstacles;
}
