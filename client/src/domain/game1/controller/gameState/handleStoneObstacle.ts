import { History } from 'history';

import { Obstacle } from '../../../../contexts/game1/Game1ContextProvider';
import { MessageTypesGame1 } from '../../../../utils/constants';
import { controllerGame1Route } from '../../../../utils/routes';
import { Socket } from '../../../socket/Socket';

interface HandleStoneActionsBase {
    controllerSocket: Socket;
    setEarlySolvableObstacle: (val: Obstacle | undefined) => void;
    resetBodyStyles: () => void;
    history: History;
    roomId: string | undefined;
}

interface HandleCollectStone extends HandleStoneActionsBase {
    setHasStone: (val: boolean) => void;
    obstacle: Obstacle;
}

export function handleCollectStone(props: HandleCollectStone) {
    const {
        controllerSocket,
        setHasStone,
        obstacle,
        setEarlySolvableObstacle,
        resetBodyStyles,
        history,
        roomId,
    } = props;

    controllerSocket.emit({
        type: MessageTypesGame1.obstacleSolved,
        obstacleId: obstacle.id,
    });
    setHasStone(true);
    setEarlySolvableObstacle(undefined);
    resetBodyStyles();
    history.push(controllerGame1Route(roomId));
}

interface HandleThrow extends HandleStoneActionsBase {
    receivingUserId: string;
    userId: string;
}

export function handleThrow(props: HandleThrow) {
    const {
        controllerSocket,
        setEarlySolvableObstacle,
        resetBodyStyles,
        history,
        roomId,
        receivingUserId,
        userId,
    } = props;

    setEarlySolvableObstacle(undefined);
    controllerSocket.emit({
        type: MessageTypesGame1.stunPlayer,
        userId,
        receivingUserId,
    });

    resetBodyStyles();
    history.push(controllerGame1Route(roomId));
}

interface HandleThrowImmediate extends HandleThrow {
    receivingUserId: string;
    userId: string;
    obstacle: Obstacle;
}

export function handleImmediateThrow(props: HandleThrowImmediate) {
    const { obstacle, controllerSocket, ...other } = props;

    controllerSocket.emit({
        type: MessageTypesGame1.obstacleSolved,
        obstacleId: obstacle.id,
    });

    handleThrow({
        controllerSocket,
        ...other,
    });
}
