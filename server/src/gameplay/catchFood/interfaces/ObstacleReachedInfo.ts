import { ObstacleType } from "./ObstacleType";

export interface ObstacleReachedInfo {
  roomId: string;
  playerId: string;
  type: ObstacleType;
}
