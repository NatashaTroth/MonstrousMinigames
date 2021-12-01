import { Obstacle } from "../../../../contexts/PlayerContextProvider";
import { ObstacleMessage } from "../../../typeGuards/game1/obstacle";

interface Dependencies {
    setObstacle: (roomId: string | undefined, obstacle: undefined | Obstacle) => void;
}
export interface HandleObstacleMessageProps {
    data: ObstacleMessage;
    roomId: string;
}

export function handleObstacleMessage(dependencies: Dependencies) {
    return (props: HandleObstacleMessageProps) => {
        const { data, roomId } = props;
        dependencies.setObstacle(roomId, {
            type: data.obstacleType,
            id: data.obstacleId,
            numberTrashItems: data.numberTrashItems,
            trashType: data.trashType,
        });
    };
}
