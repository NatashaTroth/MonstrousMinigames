import { Obstacle } from '../../../contexts/PlayerContextProvider';
import { ApproachingSolvableObstacleMessage } from '../../typeGuards/approachingSolvableObstacleTypeGuard';

interface HandleApproachingObstacleMessageProps {
    data: ApproachingSolvableObstacleMessage;
    setEarlySkipableObstacle: (value: undefined | Obstacle) => void;
}

export function handleApproachingObstacleMessage(props: HandleApproachingObstacleMessageProps) {
    const { data, setEarlySkipableObstacle } = props;
    setEarlySkipableObstacle({ id: data.obstacleId, type: data.obstacleType, distance: data.distance });
}
