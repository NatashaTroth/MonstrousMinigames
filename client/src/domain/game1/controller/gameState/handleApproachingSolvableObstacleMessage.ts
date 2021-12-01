import { Obstacle } from "../../../../contexts/PlayerContextProvider";
import {
    ApproachingSolvableObstacleMessage
} from "../../../typeGuards/game1/approachingSolvableObstacleTypeGuard";

interface Dependencies {
    setEarlySolvableObstacle: (value: undefined | Obstacle) => void;
}

export function handleApproachingObstacleMessage(dependencies: Dependencies) {
    return (data: ApproachingSolvableObstacleMessage) => {
        if (data.distance < 10) {
            dependencies.setEarlySolvableObstacle(undefined);
            return;
        }

        dependencies.setEarlySolvableObstacle({
            id: data.obstacleId,
            type: data.obstacleType,
            distance: data.distance,
        });
    };
}
