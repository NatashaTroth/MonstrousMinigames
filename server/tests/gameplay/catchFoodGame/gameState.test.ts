import { User } from "../../../src/interfaces/interfaces";
import { CatchFoodGame } from "../../../src/gameplay";
import { Obstacle } from "../../../src/gameplay/catchFood/interfaces";
import GameEventEmitter from "../../../src/classes/GameEventEmitter";
// import {
//   ObstacleReachedInfo,
//   PlayerFinishedInfo,
//   GameStateInfo,
// } from "../../src/gameplay/catchFood/interfaces";
import { GameEventTypes, GameState } from "../../../src/gameplay/interfaces";
// import { GameStartInfo } from "../../src/gameplay/catchFood/interfaces/GameStartInfo";

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

describe("Change and verify game state", () => {
  beforeEach(async () => {
    catchFoodGame = new CatchFoodGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES);
  });

  it("shouldn't be able to move player until game has started", async () => {
    // expect(() => catchFoodGame.runForward("1")).toThrow();
    const initialPositionX = catchFoodGame.playersState["1"].positionX;
    catchFoodGame.runForward("50");
    expect(catchFoodGame.playersState["1"].positionX).toBe(initialPositionX);
  });

  it("shouldn't be able to complete obstacle until game has started", async () => {
    const obstacleCompleted = catchFoodGame.playersState["1"].obstacles.length;
    catchFoodGame.playerHasCompletedObstacle("1");
    expect(catchFoodGame.playersState["1"].obstacles.length).toBe(
      obstacleCompleted
    );
  });

  it("shouldn't be able to stop game unless game has started", async () => {
    catchFoodGame.stopGame();
    expect(catchFoodGame.gameState).toBe(GameState.Created);
  });

  it("start the game", async () => {
    catchFoodGame.startGame();
    expect(catchFoodGame.gameState).toBe(GameState.Started);
  });

  it("stop the game", async () => {
    catchFoodGame.startGame();
    catchFoodGame.stopGame();
    expect(catchFoodGame.gameState).toBe(GameState.Stopped);
  });

  it("reset the game", async () => {
    catchFoodGame.startGame();
    catchFoodGame.stopGame();
    catchFoodGame.resetGame(users);
    expect(catchFoodGame.gameState).toBe(GameState.Created);
  });
});
