import { Obstacle } from "../../../../contexts/PlayerContextProvider";
import messageHandler from "../../../socket/messageHandler";
import { ObstacleMessage, obstacleTypeGuard } from "../../../typeGuards/game1/obstacle";

interface Dependencies {
    setObstacle: (roomId: string | undefined, obstacle: undefined | Obstacle) => void;
}
export interface HandleObstacleMessageProps {
    data: ObstacleMessage;
    roomId: string;
}

export const obstacleHandler = messageHandler(obstacleTypeGuard, (message, dependencies: Dependencies, roomId) => {
    dependencies.setObstacle(roomId, {
        type: message.obstacleType,
        id: message.obstacleId,
        numberTrashItems: message.numberTrashItems,
        trashType: message.trashType,
    });
});
