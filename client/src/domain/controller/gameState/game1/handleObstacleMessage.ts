import { Obstacle } from '../../../../contexts/PlayerContextProvider';
import { ObstacleMessage } from '../../../typeGuards/obstacle';

interface HandleMessageDataProps {
    data: ObstacleMessage;
    roomId: string;
    setObstacle: (roomId: string | undefined, obstacle: undefined | Obstacle) => void;
}

export function handleObstacleMessage(props: HandleMessageDataProps) {
    const { data, setObstacle, roomId } = props;
    setObstacle(roomId, {
        type: data.obstacleType,
        id: data.obstacleId,
        numberTrashItems: data.numberTrashItems,
        trashType: data.trashType,
    });
}
