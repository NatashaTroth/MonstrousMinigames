import { Obstacle } from './Obstacle';

export interface PlayerState {
  id: string;
  name: string;
  positionX: number;
  obstacles: Array<Obstacle>;
  atObstacle: boolean;
  finished: boolean;
  finishedTimeMs: number
  rank: number;
}
