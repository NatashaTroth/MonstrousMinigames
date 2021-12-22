
const COUNTDOWN_TIME = 3000;

const LENGTH_X = 1800;
const LENGTH_Y = 700;

const SPEED = 2;
const SNEAKING_SPEED = 1;


const PLAYERS_POSITIONS = [
    {
        x: 100,
        y: 100
    },
    {
        x: 1700,
        y: 600
    },
    {
        x: 1700,
        y: 100
    },
    {
        x: 100,
        y: 600
    }
];

const MARGIN = 20;

const SHEEP_COUNT = 65;

const KILL_RADIUS = 50;
const KILLS_PER_ROUND = 5;

const ROUNDS = 5;

type phaseTimes = {
    [key: string]: number;
}

const PHASE_TIMES: phaseTimes = {
    'counting': 30000,
    'guessing': 10000,
    'results': 5000
}

const GOOD_GUESS_THRESHOLD = 3;

const SHEEP_FREEZE_MIN_MS = 500;
const SHEEP_FREEZE_MAX_MS = 5000;

const SHEEP_DIRECTIONS_COUNT = 40;

const BRIGHTNESS_TIMEOUT = 3000;
const BRIGHTNESS_INTERVAL = 10;
const BRIGHTNESS_MINIMUM = 10;

const BRIGHTNESS_STEP = (100 - BRIGHTNESS_MINIMUM) / ((PHASE_TIMES['counting'] - BRIGHTNESS_TIMEOUT) / BRIGHTNESS_INTERVAL)


export default {
    COUNTDOWN_TIME,
    LENGTH_X,
    LENGTH_Y,
    SPEED,
    SNEAKING_SPEED,
    PLAYERS_POSITIONS,
    MARGIN,
    SHEEP_COUNT,
    KILL_RADIUS,
    KILLS_PER_ROUND,
    ROUNDS,
    PHASE_TIMES,
    GOOD_GUESS_THRESHOLD,
    SHEEP_FREEZE_MIN_MS,
    SHEEP_FREEZE_MAX_MS,
    SHEEP_DIRECTIONS_COUNT,
    BRIGHTNESS_STEP,
    BRIGHTNESS_TIMEOUT,
    BRIGHTNESS_INTERVAL,
    BRIGHTNESS_MINIMUM
}
