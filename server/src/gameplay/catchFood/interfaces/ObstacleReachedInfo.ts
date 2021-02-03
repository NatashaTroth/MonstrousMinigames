import { ObstacleType } from "./ObstacleType";

export interface ObstacleReachedInfo {
  roomId: string;
  userId: string;
  obstacleType: ObstacleType;
}
