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

describe("Get Obstacle Positions test", () => {
  beforeEach(async () => {
    catchFoodGame = new CatchFoodGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES);
    obstacles = catchFoodGame.getObstaclePositions();
  });

  it("should return the correct number of users", async () => {
    expect(Object.keys(obstacles).length).toBe(users.length);
  });

  it("should return the correct number of obstacles", async () => {
    expect(obstacles["1"].length).toBe(NUMBER_OF_OBSTACLES);
  });

  it("should contain the key obstacle positionX", async () => {
    expect(Object.keys(obstacles["1"][0])).toContain("positionX");
  });

  it("should contain the obstacle type", async () => {
    expect(Object.keys(obstacles["1"][0])).toContain("type");
  });

  // it("should contain the obstacle type", async () => {
  //   expect(Object.keys(obstacles["1"][0].type)).toBeInstanceOf(ObstacleType);
  // });
});
