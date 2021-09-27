import { Obstacle } from "../../../contexts/PlayerContextProvider";
import {
    ApproachingSkippableObstacleMessage
} from "../../typeGuards/approachingSkippableObstacleTypeGuard";

interface HandleApproachingObstacleMessageProps {
    data: ApproachingSkippableObstacleMessage;
    setEarlySkipableObstacle: (value: undefined | Obstacle) => void;
}

export function handleApproachingObstacleMessage(props: HandleApproachingObstacleMessageProps) {
    const { data, setEarlySkipableObstacle } = props;
    setEarlySkipableObstacle({ id: data.obstacleId, type: data.obstacleType, distance: data.distance });
}
