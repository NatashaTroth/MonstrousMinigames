import { MessageTypes, ObstacleTypes } from "../../utils/constants";
import { MessageData } from "./MessageData";

export interface ApproachingSkippableObstacleMessage {
    type: MessageTypes.approachingSkippableObstacle;
    obstacleType: ObstacleTypes;
    obstacleId: number;
    distance: number;
}

export const approachingSkippableObstacleTypeGuard = (data: MessageData): data is ApproachingSkippableObstacleMessage =>
    (data as ApproachingSkippableObstacleMessage).type === MessageTypes.approachingSkippableObstacle;
