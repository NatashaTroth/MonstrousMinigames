import { User } from "../../src/interfaces/interfaces";
import { CatchFoodGame } from "../../src/gameplay/";
import { Obstacle } from "../../src/gameplay/catchFood/interfaces";
import GameEventEmitter from "../../src/classes/GameEventEmitter";
import {
  ObstacleReachedInfo,
  PlayerFinishedInfo,
} from "../../src/gameplay/catchFood/interfaces";
import { GameEventTypes, GameState } from "../../src/gameplay/interfaces";

describe("Test catch food gameplay", () => {
  // beforeAll(async () => {
  //   await setupDb();
  // });
  let users: Array<User> = [
    {
      id: "1",
      name: "John",
      roomId: "xxx",
      timestamp: 4242,
    },
    {
      id: "2",
      name: "Lisa",
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

  //const catchFoodGame = new CatchFoodGame(users, 500, 4);

  it("initiates players", async () => {
    const catchFoodGame = new CatchFoodGame(users, 500, 4);
    expect(Object.keys(catchFoodGame.playersState).length).toBe(4);
    expect(catchFoodGame.trackLength).toBe(500);
    expect(catchFoodGame.numberOfObstacles).toBe(4);
    expect(catchFoodGame.currentRank).toBe(1);
    expect(catchFoodGame.playersState["1"].name).toBe("John");
    expect(catchFoodGame.playersState["1"].positionX).toBe(0);
    expect(catchFoodGame.playersState["1"].atObstacle).toBeFalsy();
    expect(catchFoodGame.playersState["1"].finished).toBeFalsy();
    expect(catchFoodGame.playersState["1"].obstacles.length).toBe(4);

    const obstacleRange = 90;

    //check obstacles are in correct ranges
    for (const [key, value] of Object.entries(catchFoodGame.playersState)) {
      let obstacles: Array<Obstacle> = value.obstacles;

      expect(obstacles[0].positionX).toBeGreaterThanOrEqual(obstacleRange);
      expect(obstacles[0].positionX).toBeLessThanOrEqual(obstacleRange * 2);

      expect(obstacles[1].positionX).toBeGreaterThanOrEqual(obstacleRange * 2);
      expect(obstacles[1].positionX).toBeLessThanOrEqual(obstacleRange * 3);

      expect(obstacles[2].positionX).toBeGreaterThanOrEqual(obstacleRange * 3);
      expect(obstacles[2].positionX).toBeLessThanOrEqual(obstacleRange * 4);

      expect(obstacles[3].positionX).toBeGreaterThanOrEqual(obstacleRange * 4);
      expect(obstacles[3].positionX).toBeLessThanOrEqual(obstacleRange * 5);
    }
  });

  it("should return the obstacle positions for each player", async () => {
    const catchFoodGame = new CatchFoodGame(users, 500, 4);
    expect(catchFoodGame.gameState).toBe(GameState.Created);
    catchFoodGame.startGame();
    expect(catchFoodGame.gameState).toBe(GameState.Started);

    try {
      catchFoodGame.startGame();
      expect(false).toBeTruthy();
    } catch (e) {
      //Yaay, error was thrown
    }
  });

  it("should return the obstacle positions for each player", async () => {
    const catchFoodGame = new CatchFoodGame(users, 500, 4);
    const obstacles = catchFoodGame.getObstaclePositions();
    expect(Object.keys(obstacles).length).toBe(4);
    expect(obstacles["1"].length).toBe(4);
    expect(Object.keys(obstacles["1"][0]).length).toBe(2);
    expect(Object.keys(obstacles["1"][0])).toContain("positionX");
    expect(Object.keys(obstacles["1"][0])).toContain("type");
  });

  it("moves players and stops when they come to an obstacle", async () => {
    const catchFoodGame = new CatchFoodGame(users, 500, 4);
    expect(catchFoodGame.playersState["1"].positionX).toBe(0);
    catchFoodGame.movePlayer("1", 10);
    expect(catchFoodGame.playersState["1"].positionX).toBe(10);
    catchFoodGame.movePlayer("1", 5);
    expect(catchFoodGame.playersState["1"].positionX).toBe(15);

    let distanceToObstacle =
      catchFoodGame.playersState["1"].obstacles[0].positionX -
      catchFoodGame.playersState["1"].positionX;

    //expect obstacle event to be fired when Obstacle is reached
    const gameEventEmitter = GameEventEmitter.getInstance();
    let obstacleEventReceived = false;

    gameEventEmitter.on(
      GameEventTypes.ObstacleReached,
      (data: ObstacleReachedInfo) => {
        obstacleEventReceived = true;
      }
    );

    catchFoodGame.movePlayer("1", distanceToObstacle);
    expect(obstacleEventReceived).toBeTruthy();
    expect(catchFoodGame.playersState["1"].atObstacle).toBeTruthy();
    expect(catchFoodGame.playersState["1"].obstacles.length).toBe(4);
    let tmpPlayerPositionX = catchFoodGame.playersState["1"].positionX;

    // Player shouldn't move because he's at an obstacle
    catchFoodGame.movePlayer("1", 50);
    expect(catchFoodGame.playersState["1"].positionX).toBe(tmpPlayerPositionX);

    catchFoodGame.playerHasCompletedObstacle("1");
    expect(catchFoodGame.playersState["1"].atObstacle).toBeFalsy();
    expect(catchFoodGame.playersState["1"].obstacles.length).toBe(3);

    // obstacle completed, should be able to move again
    catchFoodGame.movePlayer("1", 5);
    expect(catchFoodGame.playersState["1"].positionX).toBe(
      tmpPlayerPositionX + 5
    );
  });

  it("should finish the game when players have reached the goal", async () => {
    const catchFoodGame = new CatchFoodGame(users, 500, 4);
    // finish player 1
    for (let i = 0; i < 4; i++) {
      catchFoodGame.playerHasCompletedObstacle("1");
    }

    //expect obstacle event to be fired when Obstacle is reached
    const gameEventEmitter = GameEventEmitter.getInstance();
    let playerFinished = false;

    gameEventEmitter.on(
      GameEventTypes.PlayerHasFinished,
      (data: PlayerFinishedInfo) => {
        playerFinished = true;
      }
    );

    expect(catchFoodGame.playersState["1"].obstacles.length).toBe(0);
    catchFoodGame.movePlayer("1", 500);
    expect(catchFoodGame.playersState["1"].finished).toBeTruthy();
    expect(playerFinished).toBeTruthy();
    expect(catchFoodGame.playersState["1"].rank).toBe(1);

    for (let i = 0; i < 4; i++) {
      catchFoodGame.playerHasCompletedObstacle("2");
      catchFoodGame.playerHasCompletedObstacle("3");
      catchFoodGame.playerHasCompletedObstacle("4");
    }
    catchFoodGame.movePlayer("2", 500);
    catchFoodGame.movePlayer("3", 500);
    catchFoodGame.movePlayer("4", 500);

    expect(catchFoodGame.playersState["2"].finished).toBeTruthy();
    expect(catchFoodGame.playersState["2"].rank).toBe(2);
    expect(catchFoodGame.playersState["3"].finished).toBeTruthy();
    expect(catchFoodGame.playersState["3"].rank).toBe(3);
    expect(catchFoodGame.playersState["4"].finished).toBeTruthy();
    expect(catchFoodGame.playersState["4"].rank).toBe(4);

    expect(catchFoodGame.gameOver).toBeTruthy();
  });

  it("should reset the game", async () => {
    const catchFoodGame = new CatchFoodGame(users, 500, 4);

    for (let i = 0; i < 4; i++) {
      catchFoodGame.playerHasCompletedObstacle("1");
    }
    expect(catchFoodGame.playersState["1"].obstacles.length).toBe(0);
    catchFoodGame.movePlayer("1", 500);
    expect(catchFoodGame.playersState["1"].finished).toBeTruthy();
    expect(catchFoodGame.playersState["1"].obstacles.length).toBe(0);

    catchFoodGame.resetGame(users, 1000, 6);
    expect(Object.keys(catchFoodGame.playersState).length).toBe(4);
    expect(catchFoodGame.trackLength).toBe(1000);
    expect(catchFoodGame.numberOfObstacles).toBe(6);
    expect(catchFoodGame.currentRank).toBe(1);
    expect(catchFoodGame.playersState["1"].name).toBe("John");
    expect(catchFoodGame.playersState["1"].positionX).toBe(0);
    expect(catchFoodGame.playersState["1"].atObstacle).toBeFalsy();
    expect(catchFoodGame.playersState["1"].finished).toBeFalsy();
    expect(catchFoodGame.playersState["1"].obstacles.length).toBe(6);
  });
});
