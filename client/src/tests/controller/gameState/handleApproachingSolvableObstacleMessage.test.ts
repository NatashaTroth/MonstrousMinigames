import {
    handleApproachingObstacleMessage
} from "../../../domain/game1/controller/gameState/handleApproachingSolvableObstacleMessage";
import {
    ApproachingSolvableObstacleMessage
} from "../../../domain/typeGuards/game1/approachingSolvableObstacleTypeGuard";
import { MessageTypesGame1, ObstacleTypes } from "../../../utils/constants";

describe('handleApproachingObstacleMessage', () => {
    const data: ApproachingSolvableObstacleMessage = {
        type: MessageTypesGame1.approachingSolvableObstacle,
        obstacleType: ObstacleTypes.spider,
        obstacleId: 1,
        distance: 200,
    };

    const setEarlySolvableObstacle = jest.fn();

    it('when message type is approachingSolvableObstacle, handed setEarlySolvableObstacle should be called', () => {
        handleApproachingObstacleMessage({
            data,
            setEarlySolvableObstacle,
        });

        expect(setEarlySolvableObstacle).toHaveBeenCalledTimes(1);
    });
});
