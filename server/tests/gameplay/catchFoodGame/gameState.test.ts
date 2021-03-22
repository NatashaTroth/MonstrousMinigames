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

  // it("should return the obstacle positions for each player", async () => {
  //   const catchFoodGame = new CatchFoodGame(users, 500, 4);
  //   const obstacles = catchFoodGame.getObstaclePositions();
  //   expect(Object.keys(obstacles).length).toBe(4);
  //   expect(obstacles["1"].length).toBe(4);
  //   expect(Object.keys(obstacles["1"][0]).length).toBe(2);
  //   expect(Object.keys(obstacles["1"][0])).toContain("positionX");
  //   expect(Object.keys(obstacles["1"][0])).toContain("type");
  // });
  // it("should emit events", async () => {
  //   //Game started
  //   const catchFoodGame = new CatchFoodGame(users, 500, 4);
  //   const gameEventEmitter = GameEventEmitter.getInstance();
  //   let gameStartedEvent = false;
  //   gameEventEmitter.on(
  //     GameEventTypes.GameHasStarted,
  //     () => {
  //       gameStartedEvent = true;
  //     }
  //   );
  //   expect(gameStartedEvent).toBeFalsy();
  //   catchFoodGame.startGame();
  //   await setTimeout(() => ({}), 100);
  //   expect(gameStartedEvent).toBeTruthy();
  //   //Game stopped
  //   // let gameStoppedEvent = false;
  //   // gameEventEmitter.on(
  //   //   GameEventTypes.Ga,
  //   //   (data: GameStartInfo) => {
  //   //     gameStoppedEvent = true;
  //   //   }
  //   // );
  //   // expect(gameStoppedEvent).toBeFalsy();
  //   // catchFoodGame.startGame();
  //   // await setTimeout(() => {}, 100);
  //   // expect(gameStoppedEvent).toBeTruthy();
  // });
  // it("should finish the game when players have reached the goal", async () => {
  //   // const catchFoodGame = new CatchFoodGame(users, 500, 4);
  //   // const gameStateInfo = catchFoodGame.getGameStateInfo();
  //   //todo
  //   // console.log(gameStateInfo.playersState[0].obstacles);
  //   // console.log(gameStateInfo.playersState[1].obstacles);
  //   // console.log(gameStateInfo.playersState[2].obstacles);
  //   // console.log(gameStateInfo.playersState[3].obstacles);
  // });
  // it("moves players and stops when they come to an obstacle", async () => {
  //   const catchFoodGame = new CatchFoodGame(users, 500, 4);
  //   catchFoodGame.startGame();
  //   expect(catchFoodGame.playersState["1"].positionX).toBe(0);
  //   catchFoodGame.runForward("1", 10);
  //   expect(catchFoodGame.playersState["1"].positionX).toBe(10);
  //   catchFoodGame.runForward("1", 5);
  //   expect(catchFoodGame.playersState["1"].positionX).toBe(15);
  //   const distanceToObstacle =
  //     catchFoodGame.playersState["1"].obstacles[0].positionX -
  //     catchFoodGame.playersState["1"].positionX;
  //   //expect obstacle event to be fired when Obstacle is reached
  //   const gameEventEmitter = GameEventEmitter.getInstance();
  //   let obstacleEventReceived = false;
  //   gameEventEmitter.on(
  //     GameEventTypes.ObstacleReached,
  //     () => {
  //       obstacleEventReceived = true;
  //     }
  //   );
  //   catchFoodGame.runForward("1", distanceToObstacle);
  //   expect(obstacleEventReceived).toBeTruthy();
  //   expect(catchFoodGame.playersState["1"].atObstacle).toBeTruthy();
  //   expect(catchFoodGame.playersState["1"].obstacles.length).toBe(4);
  //   const tmpPlayerPositionX = catchFoodGame.playersState["1"].positionX;
  //   // Player shouldn't move because he's at an obstacle
  //   catchFoodGame.runForward("1", 50);
  //   expect(catchFoodGame.playersState["1"].positionX).toBe(tmpPlayerPositionX);
  //   catchFoodGame.playerHasCompletedObstacle("1");
  //   expect(catchFoodGame.playersState["1"].atObstacle).toBeFalsy();
  //   expect(catchFoodGame.playersState["1"].obstacles.length).toBe(3);
  //   // obstacle completed, should be able to move again
  //   catchFoodGame.runForward("1", 5);
  //   expect(catchFoodGame.playersState["1"].positionX).toBe(
  //     tmpPlayerPositionX + 5
  //   );
  // });
  // // it("throw an error if userId is not registered to the game", async () => {
  // //   const catchFoodGame = new CatchFoodGame(users, 500, 4);
  // //   catchFoodGame.startGame();
  // // try {
  // //   catchFoodGame.runForward("notUserId");
  // //   expect(true).toBeFalsy();
  // // } catch (e) {
  // //   //yaay, error was thrown
  // // }
  // // try {
  // //   catchFoodGame.playerHasCompletedObstacle("notUserId");
  // //   expect(true).toBeFalsy();
  // // } catch (e) {
  // //   //yaay, error was thrown
  // // }
  // // });
  // it("should finish the game when players have reached the goal", async () => {
  //   const catchFoodGame = new CatchFoodGame(users, 500, 4);
  //   catchFoodGame.startGame();
  //   // finish player 1
  //   for (let i = 0; i < 4; i++) {
  //     catchFoodGame.playerHasCompletedObstacle("1");
  //   }
  //   //expect obstacle event to be fired when Obstacle is reached
  //   const gameEventEmitter = GameEventEmitter.getInstance();
  //   let playerFinished = false;
  //   gameEventEmitter.on(
  //     GameEventTypes.PlayerHasFinished,
  //     () => {
  //       playerFinished = true;
  //     }
  //   );
  //   expect(catchFoodGame.playersState["1"].obstacles.length).toBe(0);
  //   catchFoodGame.runForward("1", 500);
  //   expect(catchFoodGame.playersState["1"].finished).toBeTruthy();
  //   expect(playerFinished).toBeTruthy();
  //   expect(catchFoodGame.playersState["1"].rank).toBe(1);
  //   // finish game
  //   let GameFinished = false;
  //   gameEventEmitter.on(
  //     GameEventTypes.PlayerHasFinished,
  //     () => {
  //       GameFinished = true;
  //     }
  //   );
  //   for (let i = 0; i < 4; i++) {
  //     catchFoodGame.playerHasCompletedObstacle("2");
  //     catchFoodGame.playerHasCompletedObstacle("3");
  //     catchFoodGame.playerHasCompletedObstacle("4");
  //   }
  //   catchFoodGame.runForward("2", 500);
  //   expect(catchFoodGame.gameState).toBe(GameState.Started);
  //   expect(catchFoodGame.playersState["2"].finished).toBeTruthy();
  //   expect(catchFoodGame.playersState["2"].rank).toBe(2);
  //   expect(catchFoodGame.currentRank).toBe(3);
  //   //run forward should no longer change anything
  //   catchFoodGame.runForward("2", 500);
  //   expect(catchFoodGame.playersState["2"].rank).toBe(2);
  //   expect(catchFoodGame.currentRank).toBe(3);
  //   catchFoodGame.runForward("3", 500);
  //   expect(catchFoodGame.playersState["3"].finished).toBeTruthy();
  //   expect(catchFoodGame.playersState["3"].rank).toBe(3);
  //   expect(catchFoodGame.gameState).toBe(GameState.Started);
  //   expect(catchFoodGame.gameState).not.toBe(GameState.Finished);
  //   catchFoodGame.runForward("4", 500);
  //   expect(catchFoodGame.playersState["4"].finished).toBeTruthy();
  //   expect(catchFoodGame.playersState["4"].rank).toBe(4);
  //   expect(catchFoodGame.gameState).not.toBe(GameState.Started);
  //   expect(catchFoodGame.gameState).toBe(GameState.Finished);
  //   expect(GameFinished).toBeTruthy();
  // });
  // it("should reset the game", async () => {
  //   const catchFoodGame = new CatchFoodGame(users, 500, 4);
  //   catchFoodGame.startGame();
  //   for (let i = 0; i < 4; i++) {
  //     catchFoodGame.playerHasCompletedObstacle("1");
  //   }
  //   expect(catchFoodGame.playersState["1"].obstacles.length).toBe(0);
  //   catchFoodGame.runForward("1", 500);
  //   expect(catchFoodGame.playersState["1"].finished).toBeTruthy();
  //   expect(catchFoodGame.playersState["1"].obstacles.length).toBe(0);
  //   catchFoodGame.resetGame(users, 1000, 6);
  //   expect(Object.keys(catchFoodGame.playersState).length).toBe(4);
  //   expect(catchFoodGame.trackLength).toBe(1000);
  //   expect(catchFoodGame.numberOfObstacles).toBe(6);
  //   expect(catchFoodGame.currentRank).toBe(1);
  //   expect(catchFoodGame.playersState["1"].name).toBe("John");
  //   expect(catchFoodGame.playersState["1"].positionX).toBe(0);
  //   expect(catchFoodGame.playersState["1"].atObstacle).toBeFalsy();
  //   expect(catchFoodGame.playersState["1"].finished).toBeFalsy();
  //   expect(catchFoodGame.playersState["1"].obstacles.length).toBe(6);
  // });
});
