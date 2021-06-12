import User from '../../../classes/user';
import { shuffleArray } from '../../../helpers/shuffleArray';
import { HashTable } from '../../interfaces';
import { ObstacleType } from '../enums';
import { Obstacle, PlayerState } from '../interfaces';

export function initiatePlayersState(
    players: Array<User>,
    numberOfObstacles: number,
    trackLength: number
): HashTable<PlayerState> {
    const obstacleTypes = getObstacleTypes(numberOfObstacles);
    const playersState: HashTable<PlayerState> = {};
    players.forEach(player => {
        playersState[player.id] = {
            id: player.id,
            name: player.name,
            positionX: 500,
            obstacles: createObstacles(obstacleTypes, numberOfObstacles, trackLength),
            atObstacle: false,
            finished: false,
            finishedTimeMs: 0,
            dead: false,
            rank: 0,
            isActive: true,
            stunned: false,
            stunnedTimeout: undefined,
            timeWhenStunned: 0,
            characterNumber: player.characterNumber, //TODO test
        };
    });

    return playersState;
}

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
    trackLength: number
): Array<Obstacle> {
    const obstacles: Array<Obstacle> = [];
    const shuffledObstacleTypes: Array<ObstacleType> = shuffleArray(obstacleTypes);

    const quadrantRange = Math.floor(trackLength / (numberOfObstacles + 1)) - 30; //e.g. 500/4 = 125, +10 to avoid obstacle being at the very beginning, - 10 to stop 2 being right next to eachother

    for (let i = 0; i < numberOfObstacles; i++) {
        const randomNr = Math.random() * quadrantRange;

        let position = randomNr + quadrantRange * (i + 1);
        position = Math.round(position / 10) * 10; //round to nearest 10 (to stop exactly at it)

        obstacles.push({
            id: i,
            positionX: position,
            type: shuffledObstacleTypes[i],
        });
    }
    return [...obstacles];
}
