import { User } from "../../../src/interfaces/interfaces";
import { CatchFoodGame } from "../../../src/gameplay";
import {
  Obstacle,
  ObstacleType,
} from "../../../src/gameplay/catchFood/interfaces";
import GameEventEmitter from "../../../src/classes/GameEventEmitter";
// import {
//   ObstacleReachedInfo,
//   PlayerFinishedInfo,
//   GameStateInfo,
// } from "../../src/gameplay/catchFood/interfaces";
// import { GameStartInfo } from "../../src/gameplay/catchFood/interfaces/GameStartInfo";
import {
  HashTable,
  GameEventTypes,
  GameState,
  GameInterface,
} from "../../../src/gameplay/interfaces";

const users: Array<User> = [
  {
    id: "1",
    name: "Harry",
    roomId: "xxx",
    timestamp: 4242,
  },
  {
    id: "2",
    name: "Ron",
    roomId: "xxx",
    timestamp: 4242,
  },
  {
    id: "3",
    name: "James",
    roomId: "xxx",
    timestamp: 4242,
  },
  {
    id: "4",
    name: "Luna",
    roomId: "xxx",
    timestamp: 4242,
  },
];

const TRACKLENGTH = 500;
const NUMBER_OF_OBSTACLES = 4;
let catchFoodGame: CatchFoodGame;
const OBSTACLE_RANGE = 70;
let obstacles: HashTable<Array<Obstacle>>;
let gameEventEmitter: GameEventEmitter;

describe("Event Emitter", () => {
  beforeAll(() => {
    gameEventEmitter = GameEventEmitter.getInstance();
  });

  beforeEach(() => {
    catchFoodGame = new CatchFoodGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES);
  });

  it("should emit an event when the game is started", async () => {
    //Game started
    let gameStartedEvent = false;
    gameEventEmitter.on(GameEventTypes.GameHasStarted, () => {
      gameStartedEvent = true;
    });
    expect(gameStartedEvent).toBeFalsy();
    catchFoodGame.startGame();
    await setTimeout(() => ({}), 100);
    expect(gameStartedEvent).toBeTruthy();
  });
});
