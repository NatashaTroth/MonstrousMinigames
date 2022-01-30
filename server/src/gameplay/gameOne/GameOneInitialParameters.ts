import { localDevelopment, shorterGame } from '../../../constants';
import { Difficulty } from '../enums/';

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
    CHASERS_POSITION_X: shorterGame && localDevelopment ? 500 : 100,
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
        TRACK_LENGTH: 5000,
        NUMBER_OBSTACLES: 3,
        STUNNED_TIME: 3000,
        NUMBER_STONES: 2, //when alive
        MAX_NUMBER_CHASER_PUSHES: 3,
        CHASER_PUSH_AMOUNT: 20,
        SPEED: 2,
        CAMERA_SPEED: 1.6,
        CHASERS_SPEED: 1.7,
        CHASERS_PUSH_SPEED: 3,
    };
};

const mediumParams = () => {
    const mediumParamsModifier = 1.4;
    return {
        TRACK_LENGTH: shorterGame && localDevelopment ? 1000 : 5000 * mediumParamsModifier,
        NUMBER_OBSTACLES: shorterGame && localDevelopment ? 0 : 5,
        STUNNED_TIME: 3000 * mediumParamsModifier,
        NUMBER_STONES: shorterGame && localDevelopment ? 0 : 5, //when alive
        MAX_NUMBER_CHASER_PUSHES: 3,
        CHASER_PUSH_AMOUNT: 20 * mediumParamsModifier,
        SPEED: 2,
        CAMERA_SPEED: shorterGame && localDevelopment ? 1 : 1.7 * mediumParamsModifier,
        CHASERS_SPEED: 1.75 * mediumParamsModifier,
        CHASERS_PUSH_SPEED: 3 * mediumParamsModifier,
    };
};

const hardParams = () => {
    const hardParamsModifier = 1.65;
    return {
        TRACK_LENGTH: 5000 * hardParamsModifier,
        NUMBER_OBSTACLES: 6,
        STUNNED_TIME: 3000 * hardParamsModifier,
        NUMBER_STONES: 6, //when alive
        MAX_NUMBER_CHASER_PUSHES: 4,
        CHASER_PUSH_AMOUNT: 20 * hardParamsModifier,
        SPEED: 2,
        CAMERA_SPEED: 1.7 * hardParamsModifier,
        CHASERS_SPEED: 1.75 * hardParamsModifier,
        CHASERS_PUSH_SPEED: 3 * hardParamsModifier,
    };
};
