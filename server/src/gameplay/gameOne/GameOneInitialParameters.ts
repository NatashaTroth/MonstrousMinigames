import { localDevelopment, shorterGame } from '../../../constants';

export const TRACK_LENGTH = shorterGame && localDevelopment ? 1000 : 5000;
export const NUMBER_OBSTACLES = shorterGame && localDevelopment ? 0 : 4;
export const COUNTDOWN_TIME = 3000;
export const STUNNED_TIME = 3000;
export const NUMBER_STONES = shorterGame && localDevelopment ? 0 : 4; //when alive
export const MAX_NUMBER_CHASER_PUSHES = 3;
export const CHASER_PUSH_AMOUNT = 20;
export const APPROACH_SOLVABLE_OBSTACLE_DISTANCE = 200;

export const SPEED = 1;

export const PLAYERS_POSITION_X = 600;
export const CHASERS_POSITION_X = 100;

export const CAMERA_POSITION_X = 0;
export const CAMERA_SPEED = 1.7;
export const CHASERS_SPEED = 1.75;
export const CHASERS_PUSH_SPEED = 3;
