import { Obstacle } from '../../../../contexts/PlayerContextProvider';
import { ApproachingSolvableObstacleMessage } from '../../../typeGuards/game1/approachingSolvableObstacleTypeGuard';

interface HandleApproachingObstacleMessageProps {
    data: ApproachingSolvableObstacleMessage;
    setEarlySolvableObstacle: (value: undefined | Obstacle) => void;
}

export function handleApproachingObstacleMessage(props: HandleApproachingObstacleMessageProps) {
    const { data, setEarlySolvableObstacle } = props;
    if (data.distance < 10) {
        setEarlySolvableObstacle(undefined);
    } else {
        setEarlySolvableObstacle({ id: data.obstacleId, type: data.obstacleType, distance: data.distance });
    }
}
