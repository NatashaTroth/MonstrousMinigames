import { MessageTypes, ObstacleTypes } from "../../utils/constants";
import {
    ApproachingSkippableObstacleMessage, approachingSkippableObstacleTypeGuard
} from "./approachingSkippableObstacleTypeGuard";

describe('approachingSkippableObstacle TypeGuard', () => {
    it('when type is approachingSkippableObstacle, it should return true', () => {
        const data: ApproachingSkippableObstacleMessage = {
            type: MessageTypes.approachingSkippableObstacle,
            obstacleId: 1,
            obstacleType: ObstacleTypes.stone,
            distance: 1,
        };

        expect(approachingSkippableObstacleTypeGuard(data)).toEqual(true);
    });
});
