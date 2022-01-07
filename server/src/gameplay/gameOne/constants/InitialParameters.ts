import { localDevelopment, shorterGame } from '../../../../constants';

const TRACK_LENGTH = shorterGame && localDevelopment ? 1000 : 5000;
const NUMBER_OBSTACLES = shorterGame && localDevelopment ? 0 : 4;
const COUNTDOWN_TIME = 3000;
const STUNNED_TIME = 3000;
const NUMBER_STONES = shorterGame && localDevelopment ? 0 : 4; //when alive
const MAX_NUMBER_CHASER_PUSHES = 3;
const CHASER_PUSH_AMOUNT = 20;
const APPROACH_SOLVABLE_OBSTACLE_DISTANCE = 200;
const SPEED = 2;
const PLAYERS_POSITION_X = 600;
const CHASERS_POSITION_X = 100;
const CAMERA_POSITION_X = 0;
const CAMERA_SPEED = 1.7;
const CHASERS_SPEED = 1.75;
const CHASERS_PUSH_SPEED = 3;

export default {
    TRACK_LENGTH,
    NUMBER_OBSTACLES,
    COUNTDOWN_TIME,
    STUNNED_TIME,
    NUMBER_STONES,
    MAX_NUMBER_CHASER_PUSHES,
    CHASER_PUSH_AMOUNT,
    APPROACH_SOLVABLE_OBSTACLE_DISTANCE,
    SPEED,
    PLAYERS_POSITION_X,
    CHASERS_POSITION_X,
    CAMERA_POSITION_X,
    CAMERA_SPEED,
    CHASERS_SPEED,
    CHASERS_PUSH_SPEED,
};
