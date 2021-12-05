
const COUNTDOWN_TIME = 3000;

const LENGTH_X = 1800;
const LENGTH_Y = 700;

const SPEED = 1;

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

const SHEEP_COUNT = 50;

const KILL_RADIUS = 5;
const KILLS_PER_ROUND = 5;

const ROUNDS = 3;

type phaseTimes = {
    [key: string]: number;
}

const PHASE_TIMES: phaseTimes = {
    'counting': 10000,
    'guessing': 10000,
    'results': 10000
}

const GOOD_GUESS_THRESHOLD = 5;

const SHEEP_FREEZE_MIN_MS = 500;
const SHEEP_FREEZE_MAX_MS = 5000;

const SHEEP_DIRECTIONS_COUNT = 40;

const BRIGHTNESS_STEP = 0.01;


export default {
    COUNTDOWN_TIME,
    LENGTH_X,
    LENGTH_Y,
    SPEED,
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
    BRIGHTNESS_STEP
}
