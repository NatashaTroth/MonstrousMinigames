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

  it("starts players at positionX 0", async () => {
    catchFoodGame.startGame();
    expect(catchFoodGame.playersState["1"].positionX).toBe(0);
  });

  it("moves players forward when runForward is called", async () => {
    const SPEED = 10;
    catchFoodGame.startGame();
    catchFoodGame.runForward("1", SPEED);
    expect(catchFoodGame.playersState["1"].positionX).toBe(SPEED);
  });

  it("moves players forward correctly when runForward is called multiple times", async () => {
    catchFoodGame.startGame();
    catchFoodGame.runForward("1", 10);
    catchFoodGame.runForward("1", 5);
    expect(catchFoodGame.playersState["1"].positionX).toBe(15);
  });

  it("recognises when player has reached an obstacle", async () => {
    catchFoodGame.startGame();
    const distanceToObstacle =
      catchFoodGame.playersState["1"].obstacles[0].positionX -
      catchFoodGame.playersState["1"].positionX;
    catchFoodGame.runForward("1", distanceToObstacle);
    expect(catchFoodGame.playersState["1"].atObstacle).toBeTruthy();
  });

  it("doesn't remove an obstacle when a player arrives at it", async () => {
    catchFoodGame.startGame();
    const distanceToObstacle =
      catchFoodGame.playersState["1"].obstacles[0].positionX -
      catchFoodGame.playersState["1"].positionX;
    catchFoodGame.runForward("1", distanceToObstacle);
    expect(catchFoodGame.playersState["1"].obstacles.length).toBe(4);
  });

  it("doesn't allow players to move when they reach an obstacle", async () => {
    catchFoodGame.startGame();
    const distanceToObstacle =
      catchFoodGame.playersState["1"].obstacles[0].positionX -
      catchFoodGame.playersState["1"].positionX;
    catchFoodGame.runForward("1", distanceToObstacle);

    const tmpPlayerPositionX = catchFoodGame.playersState["1"].positionX;
    catchFoodGame.runForward("1", 50);
    expect(catchFoodGame.playersState["1"].positionX).toBe(tmpPlayerPositionX);
  });

  it("should recognise when a player has completed an obstacle", async () => {
    catchFoodGame.startGame();
    const distanceToObstacle =
      catchFoodGame.playersState["1"].obstacles[0].positionX -
      catchFoodGame.playersState["1"].positionX;
    catchFoodGame.runForward("1", distanceToObstacle);
    catchFoodGame.playerHasCompletedObstacle("1");
    expect(catchFoodGame.playersState["1"].atObstacle).toBeFalsy();
  });

  it("should remove a completed obstacle", async () => {
    catchFoodGame.startGame();
    const distanceToObstacle =
      catchFoodGame.playersState["1"].obstacles[0].positionX -
      catchFoodGame.playersState["1"].positionX;
    catchFoodGame.runForward("1", distanceToObstacle);
    catchFoodGame.playerHasCompletedObstacle("1");
    expect(catchFoodGame.playersState["1"].obstacles.length).toBe(3);
  });

  it("can move a player again when obstacle is completed", async () => {
    catchFoodGame.startGame();
    const distanceToObstacle =
      catchFoodGame.playersState["1"].obstacles[0].positionX -
      catchFoodGame.playersState["1"].positionX;
    catchFoodGame.runForward("1", distanceToObstacle);
    catchFoodGame.playerHasCompletedObstacle("1");
    const tmpPlayerPositionX = catchFoodGame.playersState["1"].positionX;
    catchFoodGame.runForward("1", 5);
    expect(catchFoodGame.playersState["1"].positionX).toBe(
      tmpPlayerPositionX + 5
    );
  });

  it("should have not obstacles left when the player has completed them", async () => {
    catchFoodGame.startGame();
    // finish player 1
    for (let i = 0; i < 4; i++) {
      catchFoodGame.playerHasCompletedObstacle("1");
    }
    expect(catchFoodGame.playersState["1"].obstacles.length).toBe(0);
  });

  it("should set a player as finished when they have reached the end of the race", async () => {
    catchFoodGame.startGame();
    // finish player 1
    for (let i = 0; i < 4; i++) {
      catchFoodGame.playerHasCompletedObstacle("1");
    }
    catchFoodGame.runForward("1", 500);
    expect(catchFoodGame.playersState["1"].finished).toBeTruthy();
  });

  it("should give the first player that finishes a rank of 1", async () => {
    catchFoodGame.startGame();
    // finish player 1
    for (let i = 0; i < 4; i++) {
      catchFoodGame.playerHasCompletedObstacle("1");
    }
    catchFoodGame.runForward("1", 500);
    expect(catchFoodGame.playersState["1"].rank).toBe(1);
  });

  it("should have a current rank of 2 after the first player has finished", async () => {
    catchFoodGame.startGame();
    // finish player 1
    for (let i = 0; i < 4; i++) {
      catchFoodGame.playerHasCompletedObstacle("1");
    }
    catchFoodGame.runForward("1", 500);
    expect(catchFoodGame.currentRank).toBe(2);
  });

  function finishGame(catchFoodGame: CatchFoodGame) {
    catchFoodGame.startGame();
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
    return catchFoodGame;
  }

  it("all players should be marked as finished", async () => {
    catchFoodGame = finishGame(catchFoodGame);
    expect(catchFoodGame.playersState["1"].finished).toBeTruthy();
    expect(catchFoodGame.playersState["2"].finished).toBeTruthy();
    expect(catchFoodGame.playersState["3"].finished).toBeTruthy();
    expect(catchFoodGame.playersState["4"].finished).toBeTruthy();
  });

  it("should give the second player that finishes a rank of 2", async () => {
    catchFoodGame = finishGame(catchFoodGame);
    expect(catchFoodGame.playersState["2"].rank).toBe(2);
  });

  it("should give the third player that finishes a rank of 3", async () => {
    catchFoodGame = finishGame(catchFoodGame);
    expect(catchFoodGame.playersState["3"].rank).toBe(3);
  });

  it("should give the fourth player that finishes a rank of 4", async () => {
    catchFoodGame = finishGame(catchFoodGame);
    expect(catchFoodGame.playersState["4"].rank).toBe(4);
  });
});
