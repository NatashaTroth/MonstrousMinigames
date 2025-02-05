import { shorterGame } from '../../../../constants';

const COUNTDOWN_TIME = 3000;

const LENGTH_X = 1920;
const LENGTH_Y = 720;

const SPEED = 2;
const SNEAKING_SPEED = 1;

const PLAYER_MARGIN = 100;

const PLAYERS_POSITIONS = [
    {
        x: PLAYER_MARGIN,
        y: PLAYER_MARGIN,
    },
    {
        x: LENGTH_X - PLAYER_MARGIN,
        y: LENGTH_Y - PLAYER_MARGIN,
    },
    {
        x: LENGTH_X - PLAYER_MARGIN,
        y: PLAYER_MARGIN,
    },
    {
        x: PLAYER_MARGIN,
        y: LENGTH_Y - PLAYER_MARGIN,
    },
];

const MARGIN = 20;

const MIN_SHEEP_COUNT = 50;
const MAX_SHEEP_COUNT = 75;

const KILL_RADIUS = 50;
const KILLS_PER_ROUND = 5;

const ROUNDS = shorterGame ? 1 : 3;

type phaseTimes = {
    [key: string]: number;
};

const PHASE_TIMES: phaseTimes = {
    counting: shorterGame ? 5000 : 50000,
    guessing: shorterGame ? 5000 : 10000,
    results: shorterGame ? 2000 : 5000,
};

const GOOD_GUESS_THRESHOLD = 5;
const BAD_GUESS_THRESHOLD = 20;

const SHEEP_FREEZE_MIN_MS = 500;
const SHEEP_FREEZE_MAX_MS = 5000;

const SHEEP_DIRECTIONS_COUNT = 40;

const BRIGHTNESS_TIMEOUT = 10000;

const BRIGHTNESS_INTERVAL = 10;
const BRIGHTNESS_MINIMUM = 15;
const BRIGHTNESS_ADJUST = 20;

const BRIGHTNESS_STEP =
    (100 - BRIGHTNESS_MINIMUM + BRIGHTNESS_ADJUST) /
    ((PHASE_TIMES['counting'] - BRIGHTNESS_TIMEOUT) / BRIGHTNESS_INTERVAL);

export default {
    COUNTDOWN_TIME,
    LENGTH_X,
    LENGTH_Y,
    SPEED,
    SNEAKING_SPEED,
    PLAYERS_POSITIONS,
    MARGIN,
    MIN_SHEEP_COUNT,
    MAX_SHEEP_COUNT,
    KILL_RADIUS,
    KILLS_PER_ROUND,
    ROUNDS,
    PHASE_TIMES,
    GOOD_GUESS_THRESHOLD,
    BAD_GUESS_THRESHOLD,
    SHEEP_FREEZE_MIN_MS,
    SHEEP_FREEZE_MAX_MS,
    SHEEP_DIRECTIONS_COUNT,
    BRIGHTNESS_STEP,
    BRIGHTNESS_TIMEOUT,
    BRIGHTNESS_INTERVAL,
    BRIGHTNESS_MINIMUM,
};
