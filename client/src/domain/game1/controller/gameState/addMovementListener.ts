import React from 'react';

import { Game1Context } from '../../../../contexts/game1/Game1ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { Socket } from '../../../socket/Socket';
import { sendMovement } from './sendMovement';

export default function addMovementListener(controllerSocket: Socket, hasPaused: boolean, playerFinished: boolean) {
    window.addEventListener('devicemotion', e =>
        sendMovementToController(e, playerFinished, controllerSocket, hasPaused, sendMovement)
    );
}

export function sendMovementToController(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
    playerFinished: boolean,
    controllerSocket: Socket,
    hasPaused: boolean,
    sendMovement: (socket: Socket, hasPaused: boolean) => void
) {
    event.preventDefault();
    if (event?.acceleration?.x && (event?.acceleration?.x < -2 || event?.acceleration?.x > 2) && !playerFinished) {
        sendMovement(controllerSocket, hasPaused);
    }
}

export const useMovementListener = (socket: Socket, permission: boolean) => {
    const { playerFinished } = React.useContext(Game1Context);
    const { hasPaused } = React.useContext(GameContext);

    React.useEffect(() => {
        if (permission) {
            addMovementListener(socket, hasPaused, playerFinished);
        }
    }, [permission, hasPaused, playerFinished, socket]);
};
