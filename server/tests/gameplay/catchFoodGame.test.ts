import { User } from "../../src/interfaces/interfaces";
import { CatchFoodGame } from "../../src/gameplay/";
import { Obstacle } from "../../src/gameplay/catchFood/interfaces";

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

  const catchFoodGame = new CatchFoodGame(users, 500, 4);

  it("initiates players", async () => {
    expect(Object.keys(catchFoodGame.playersState).length).toBe(4);
    expect(catchFoodGame.trackLength).toBe(500);
    expect(catchFoodGame.numberOfObstacles).toBe(4);
    expect(catchFoodGame.currentRank).toBe(1);
    expect(catchFoodGame.playersState["1"].name).toBe("John");
    expect(catchFoodGame.playersState["1"].positionX).toBe(0);
    expect(catchFoodGame.playersState["1"].atObstacle).toBe(false);
    expect(catchFoodGame.playersState["1"].finished).toBe(false);
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

  it("moves players", async () => {});
});
