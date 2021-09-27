import { Obstacle } from '../../../contexts/PlayerContextProvider';
import { ApproachingSolvableObstacleMessage } from '../../typeGuards/approachingSolvableObstacleTypeGuard';

interface HandleApproachingObstacleMessageProps {
    data: ApproachingSolvableObstacleMessage;
    setEarlySolvableObstacle: (value: undefined | Obstacle) => void;
}

export function handleApproachingObstacleMessage(props: HandleApproachingObstacleMessageProps) {
    const { data, setEarlySolvableObstacle } = props;
    setEarlySolvableObstacle({ id: data.obstacleId, type: data.obstacleType, distance: data.distance });
}
