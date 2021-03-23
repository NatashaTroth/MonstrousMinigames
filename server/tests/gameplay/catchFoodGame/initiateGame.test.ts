import { CatchFoodGame } from "../../../src/gameplay";
import { Obstacle } from "../../../src/gameplay/catchFood/interfaces";
import { GameState } from "../../../src/gameplay/interfaces";
import { users } from "../mockUsers";

const TRACKLENGTH = 500;
const NUMBER_OF_OBSTACLES = 4;
let catchFoodGame: CatchFoodGame;
const OBSTACLE_RANGE = 70;

describe("Initiate CatchFoodGame correctly", () => {
  beforeEach(async () => {
    catchFoodGame = new CatchFoodGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES);
  });

  it("initiates players state with correct number of players", async () => {
    expect(Object.keys(catchFoodGame.playersState).length).toBe(
      NUMBER_OF_OBSTACLES
    );
  });

  it("initiates trackLength with correct length", async () => {
    expect(catchFoodGame.trackLength).toBe(TRACKLENGTH);
  });

  it("initiates correct number of obstacles", async () => {
    expect(catchFoodGame.numberOfObstacles).toBe(NUMBER_OF_OBSTACLES);
  });

  it("initiates current rank as 1", async () => {
    expect(catchFoodGame.currentRank).toBe(1);
  });

  it("initiates current rank as 1", async () => {
    expect(catchFoodGame.currentRank).toBe(1);
  });

  it("initiates first player with the correct name", async () => {
    expect(catchFoodGame.playersState["1"].name).toBe(users[0].name);
  });

  it("initiates player positionX with 0", async () => {
    expect(catchFoodGame.playersState["1"].positionX).toBe(0);
  });

  it("initiates player not at an obstacle", async () => {
    expect(catchFoodGame.playersState["1"].atObstacle).toBeFalsy();
  });

  it("initiates player as not finished", async () => {
    expect(catchFoodGame.playersState["1"].finished).toBeFalsy();
  });

  it("initiates player with correct number of obstacles (all)", async () => {
    expect(catchFoodGame.playersState["1"].obstacles.length).toBe(
      NUMBER_OF_OBSTACLES
    );
  });

  it("initiates the first obstacle in the correct range", async () => {
    const obstacles: Array<Obstacle> =
      catchFoodGame.playersState["1"].obstacles;
    expect(obstacles[0].positionX).toBeGreaterThanOrEqual(OBSTACLE_RANGE);
    expect(obstacles[0].positionX).toBeLessThanOrEqual(OBSTACLE_RANGE * 2);
  });

  it("initiates the second obstacle in the correct range", async () => {
    const obstacles: Array<Obstacle> =
      catchFoodGame.playersState["1"].obstacles;
    expect(obstacles[1].positionX).toBeGreaterThanOrEqual(OBSTACLE_RANGE * 2);
    expect(obstacles[1].positionX).toBeLessThanOrEqual(OBSTACLE_RANGE * 3);
  });

  it("initiates the third obstacle in the correct range", async () => {
    const obstacles: Array<Obstacle> =
      catchFoodGame.playersState["1"].obstacles;
    expect(obstacles[2].positionX).toBeGreaterThanOrEqual(OBSTACLE_RANGE * 3);
    expect(obstacles[2].positionX).toBeLessThanOrEqual(OBSTACLE_RANGE * 4);
  });

  it("initiates the fourth obstacle in the correct range", async () => {
    const obstacles: Array<Obstacle> =
      catchFoodGame.playersState["1"].obstacles;
    expect(obstacles[3].positionX).toBeGreaterThanOrEqual(OBSTACLE_RANGE * 4);
    expect(obstacles[3].positionX).toBeLessThanOrEqual(OBSTACLE_RANGE * 5);
  });

  it("initiates gameState as Created", async () => {
    expect(catchFoodGame.gameState).toBe(GameState.Created);
  });
});
