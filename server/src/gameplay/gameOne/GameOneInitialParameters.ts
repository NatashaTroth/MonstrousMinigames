import { localDevelopment, shorterGame } from '../../../constants';
import { Difficulty } from './enums/Difficulty';

// export const TRACK_LENGTH = shorterGame && localDevelopment ? 1000 : 5000;
// export const NUMBER_OBSTACLES = shorterGame && localDevelopment ? 0 : 4;
// export const COUNTDOWN_TIME = 3000;
// export const STUNNED_TIME = 3000;
// export const NUMBER_STONES = shorterGame && localDevelopment ? 0 : 4; //when alive
// export const MAX_NUMBER_CHASER_PUSHES = 3;
// export const CHASER_PUSH_AMOUNT = 20;
// export const APPROACH_SOLVABLE_OBSTACLE_DISTANCE = 200;

// export const SPEED = 1;

// export const PLAYERS_POSITION_X = 600;
// export const CHASERS_POSITION_X = 100;

// export const CAMERA_POSITION_X = 0;
// export const CAMERA_SPEED = 1.7;
// export const CHASERS_SPEED = 1.75;
// export const CHASERS_PUSH_SPEED = 3;

export interface InitialParams {
    TRACK_LENGTH: number;
    NUMBER_OBSTACLES: number;
    COUNTDOWN_TIME: number;
    STUNNED_TIME: number;
    NUMBER_STONES: number;
    MAX_NUMBER_CHASER_PUSHES: number;
    CHASER_PUSH_AMOUNT: number;
    APPROACH_SOLVABLE_OBSTACLE_DISTANCE: number;
    SPEED: number;
    PLAYERS_POSITION_X: number;
    CHASERS_POSITION_X: number;
    CAMERA_POSITION_X: number;
    CAMERA_SPEED: number;
    CHASERS_SPEED: number;
    CHASERS_PUSH_SPEED: number;
}

const commonParams = {
    COUNTDOWN_TIME: 3000,
    APPROACH_SOLVABLE_OBSTACLE_DISTANCE: 200,
    PLAYERS_POSITION_X: 600,
    CHASERS_POSITION_X: 100,
    CAMERA_POSITION_X: 0,
};

export const getInitialParams = (difficulty = Difficulty.MEDIUM): InitialParams => {
    let params;
    switch (difficulty) {
        case Difficulty.EASY:
            params = easyParams();
            break;
        case Difficulty.HARD:
            params = hardParams();
            break;
        default:
            params = mediumParams();
            break;
    }
    return { ...commonParams, ...params };
};

const easyParams = () => {
    return {
        TRACK_LENGTH: shorterGame && localDevelopment ? 1000 : 4000,
        NUMBER_OBSTACLES: shorterGame && localDevelopment ? 0 : 4,
        STUNNED_TIME: 3000,
        NUMBER_STONES: shorterGame && localDevelopment ? 0 : 4, //when alive
        MAX_NUMBER_CHASER_PUSHES: 3,
        CHASER_PUSH_AMOUNT: 20,
        SPEED: 1,
        CAMERA_SPEED: 1.7,
        CHASERS_SPEED: 1.75,
        CHASERS_PUSH_SPEED: 3,
    };
};

const mediumParams = () => {
    return {
        TRACK_LENGTH: shorterGame && localDevelopment ? 1000 : 5000,
        NUMBER_OBSTACLES: shorterGame && localDevelopment ? 0 : 4,
        STUNNED_TIME: 3000,
        NUMBER_STONES: shorterGame && localDevelopment ? 0 : 4, //when alive
        MAX_NUMBER_CHASER_PUSHES: 3,
        CHASER_PUSH_AMOUNT: 20,
        SPEED: 1,
        CAMERA_SPEED: 1.7,
        CHASERS_SPEED: 1.75,
        CHASERS_PUSH_SPEED: 3,
    };
};

const hardParams = () => {
    return {
        TRACK_LENGTH: shorterGame && localDevelopment ? 1000 : 6000,
        NUMBER_OBSTACLES: shorterGame && localDevelopment ? 0 : 5,
        STUNNED_TIME: 4000,
        NUMBER_STONES: shorterGame && localDevelopment ? 0 : 4, //when alive
        MAX_NUMBER_CHASER_PUSHES: 4,
        CHASER_PUSH_AMOUNT: 30,
        SPEED: 1,
        CAMERA_SPEED: 1.9,
        CHASERS_SPEED: 1.8,
        CHASERS_PUSH_SPEED: 4,
    };
};
