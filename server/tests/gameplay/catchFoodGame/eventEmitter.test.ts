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

  it("should emit a GameHasStarted event when the game is started", async () => {
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

  it("should emit an ObstacleReached event when an obstacle is reached", async () => {
    catchFoodGame.startGame();

    let obstacleEventReceived = false;
    gameEventEmitter.on(GameEventTypes.ObstacleReached, () => {
      obstacleEventReceived = true;
    });

    const distanceToObstacle =
      catchFoodGame.playersState["1"].obstacles[0].positionX -
      catchFoodGame.playersState["1"].positionX;
    catchFoodGame.runForward("1", distanceToObstacle);
    expect(obstacleEventReceived).toBeTruthy();
  });

  it("should emit an PlayerHasFinished event when a player has reached the end of the race", async () => {
    catchFoodGame.startGame();
    // finish player 1
    for (let i = 0; i < 4; i++) {
      catchFoodGame.playerHasCompletedObstacle("1");
    }
    //
    const gameEventEmitter = GameEventEmitter.getInstance();
    let playerFinished = false;
    gameEventEmitter.on(GameEventTypes.PlayerHasFinished, () => {
      playerFinished = true;
    });
    catchFoodGame.runForward("1", 500);
    expect(playerFinished).toBeTruthy();
  });

  it("should emit a PlayerHasFinished event when a all the players have finished race", async () => {
    catchFoodGame.startGame();
    let gameFinishedEvent = false;
    gameEventEmitter.on(GameEventTypes.PlayerHasFinished, () => {
      gameFinishedEvent = true;
    });
    // finish game
    for (let i = 0; i < 4; i++) {
      catchFoodGame.playerHasCompletedObstacle("1");
      catchFoodGame.playerHasCompletedObstacle("2");
      catchFoodGame.playerHasCompletedObstacle("3");
      catchFoodGame.playerHasCompletedObstacle("4");
    }

    catchFoodGame.runForward("1", 500);
    catchFoodGame.runForward("2", 500);
    catchFoodGame.runForward("3", 500);
    catchFoodGame.runForward("4", 500);
    expect(gameFinishedEvent).toBeTruthy();
  });
});
